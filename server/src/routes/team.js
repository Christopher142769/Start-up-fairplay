import { Router } from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import rateLimit from 'express-rate-limit';
import { requireGroup } from '../middleware/auth.js';
import { SubmissionFile } from '../models/SubmissionFile.js';
import { Thread } from '../models/Thread.js';
import { Message } from '../models/Message.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsRoot = path.join(__dirname, '../../uploads');

const ALLOWED_MIMES = new Set([
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.ms-powerpoint',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/png',
  'image/jpeg',
  'image/jpg',
  'video/mp4',
  'video/quicktime',
  'video/webm',
  'video/x-msvideo',
  'video/x-matroska',
  'video/mpeg',
  'video/3gpp',
]);

const ALLOWED_EXT = new Set([
  'pdf',
  'pptx',
  'ppt',
  'doc',
  'docx',
  'png',
  'jpeg',
  'jpg',
  'mp4',
  'webm',
  'mov',
  'avi',
  'mkv',
  'mpeg',
  'mpg',
  'm4v',
  '3gp',
]);

const MAX_BYTES = 200 * 1024 * 1024;

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function extOf(name) {
  const n = String(name || '').toLowerCase();
  const i = n.lastIndexOf('.');
  return i >= 0 ? n.slice(i + 1) : '';
}

function fileFilter(_req, file, cb) {
  const ext = extOf(file.originalname);
  if (ALLOWED_EXT.has(ext) || ALLOWED_MIMES.has(file.mimetype)) {
    return cb(null, true);
  }
  cb(new Error('TYPE_DE_FICHIER_NON_AUTORISE'));
}

const uploadLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
});

export const teamRouter = Router();
teamRouter.use(requireGroup);
teamRouter.use(uploadLimit);

function storageForGroup(groupId) {
  const dir = path.join(uploadsRoot, 'groups', String(groupId));
  ensureDir(dir);
  return multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, dir),
    filename: (_req, file, cb) => {
      const ext = extOf(file.originalname);
      const safe = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${ext ? `.${ext}` : ''}`;
      cb(null, safe);
    },
  });
}

function multerForGroup(groupId) {
  return multer({
    storage: storageForGroup(groupId),
    limits: { fileSize: MAX_BYTES, files: 20 },
    fileFilter,
  });
}

teamRouter.get('/me', async (req, res) => {
  const g = req.group;
  const thread = await Thread.findOne({ group: g._id }).lean();
  res.json({
    id: g._id,
    groupName: g.groupName,
    leaderEmail: g.leaderEmail,
    school: g.school,
    unreadMessages: thread?.groupUnreadCount || 0,
  });
});

teamRouter.post('/submissions', (req, res, next) => {
  const upload = multerForGroup(req.group._id).array('files', 20);
  upload(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ error: 'Fichier trop volumineux (max 200 Mo par fichier)' });
        }
        return res.status(400).json({ error: err.message });
      }
      if (err.message === 'TYPE_DE_FICHIER_NON_AUTORISE') {
        return res.status(400).json({ error: 'Type de fichier non autorisé' });
      }
      return next(err);
    }
    next();
  });
}, async (req, res) => {
  const files = req.files || [];
  if (!files.length) {
    return res.status(400).json({ error: 'Aucun fichier' });
  }
  const groupId = req.group._id;
  const dir = path.relative(uploadsRoot, path.join(uploadsRoot, 'groups', String(groupId)));
  const docs = [];
  for (const f of files) {
    const doc = await SubmissionFile.create({
      group: groupId,
      originalName: f.originalname,
      storedName: f.filename,
      mimeType: f.mimetype,
      size: f.size,
      relativePath: path.join(dir, f.filename).replace(/\\/g, '/'),
    });
    docs.push(doc);
  }
  res.status(201).json(docs);
});

teamRouter.get('/submissions', async (req, res) => {
  const list = await SubmissionFile.find({ group: req.group._id }).sort({ createdAt: -1 }).lean();
  res.json(list);
});

teamRouter.delete('/submissions/:id', async (req, res) => {
  const doc = await SubmissionFile.findOne({ _id: req.params.id, group: req.group._id });
  if (!doc) return res.status(404).json({ error: 'Introuvable' });
  const abs = path.join(uploadsRoot, doc.relativePath);
  try {
    await fs.promises.unlink(abs);
  } catch {
    /* ignore */
  }
  await doc.deleteOne();
  res.json({ ok: true });
});

async function getOrCreateThread(groupId) {
  let t = await Thread.findOne({ group: groupId });
  if (!t) {
    t = await Thread.create({ group: groupId });
  }
  return t;
}

teamRouter.get('/messages', async (req, res) => {
  const thread = await getOrCreateThread(req.group._id);
  const msgs = await Message.find({ thread: thread._id }).sort({ createdAt: 1 }).lean();
  thread.groupUnreadCount = 0;
  await thread.save();
  res.json({ threadId: thread._id, messages: msgs });
});

teamRouter.post('/messages', async (req, res) => {
  const { body } = req.body || {};
  if (!body || !String(body).trim()) {
    return res.status(400).json({ error: 'Message vide' });
  }
  const thread = await getOrCreateThread(req.group._id);
  const msg = await Message.create({
    thread: thread._id,
    fromRole: 'group',
    body: String(body).trim(),
  });
  thread.lastMessageAt = new Date();
  thread.adminUnreadCount = (thread.adminUnreadCount || 0) + 1;
  await thread.save();
  res.status(201).json(msg);
});
