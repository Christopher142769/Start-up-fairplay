import { Router } from 'express';
import path from 'path';
import fs from 'fs';
import archiver from 'archiver';
import bcrypt from 'bcryptjs';
import rateLimit from 'express-rate-limit';
import sanitize from 'sanitize-filename';
import { fileURLToPath } from 'url';
import { AdminUser } from '../models/AdminUser.js';
import { Group } from '../models/Group.js';
import { OtpCode } from '../models/OtpCode.js';
import { SubmissionFile } from '../models/SubmissionFile.js';
import { Thread } from '../models/Thread.js';
import { Message } from '../models/Message.js';
import { School } from '../models/School.js';
import { sendMail } from '../mail.js';
import { generateSixDigitCode } from '../utils/otp.js';
import { signAdminToken, requireAdmin } from '../middleware/auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsRoot = path.join(__dirname, '../../uploads');

export const adminRouter = Router();

const authLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
});

const otpTtlMs = 10 * 60 * 1000;

async function storeOtp(email, purpose, plainCode) {
  await OtpCode.updateMany(
    { email, purpose, consumed: false },
    { $set: { consumed: true } }
  );
  const codeHash = await bcrypt.hash(plainCode, 10);
  await OtpCode.create({
    email,
    codeHash,
    purpose,
    expiresAt: new Date(Date.now() + otpTtlMs),
  });
}

async function verifyOtp(email, purpose, plainCode) {
  const row = await OtpCode.findOne({
    email,
    purpose,
    consumed: false,
    expiresAt: { $gt: new Date() },
  }).sort({ createdAt: -1 });
  if (!row) return false;
  const ok = await bcrypt.compare(plainCode, row.codeHash);
  if (ok) {
    row.consumed = true;
    await row.save();
  }
  return ok;
}

adminRouter.post('/auth/request-code', authLimit, async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'E-mail et mot de passe requis' });
    }
    const admin = await AdminUser.findOne({ email: String(email).toLowerCase().trim() });
    if (!admin) {
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }
    const match = await bcrypt.compare(password, admin.passwordHash);
    if (!match) return res.status(401).json({ error: 'Identifiants incorrects' });
    const code = generateSixDigitCode();
    await storeOtp(admin.email, 'admin_login', code);
    await sendMail({
      to: admin.email,
      subject: 'Fair Play Admin — code de connexion',
      text: `Votre code administrateur : ${code}\n\nValide 10 minutes.`,
      html: `<p>Code <strong>administrateur Fair Play</strong> :</p><p style="font-size:24px;letter-spacing:4px">${code}</p>`,
    });
    res.json({ ok: true, message: 'Code envoyé par e-mail.' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Impossible d’envoyer l’e-mail.' });
  }
});

adminRouter.post('/auth/verify-code', authLimit, async (req, res) => {
  try {
    const { email, password, code } = req.body || {};
    if (!email || !password || !code) {
      return res.status(400).json({ error: 'Champs requis' });
    }
    const admin = await AdminUser.findOne({ email: String(email).toLowerCase().trim() });
    if (!admin) return res.status(401).json({ error: 'Identifiants incorrects' });
    const match = await bcrypt.compare(password, admin.passwordHash);
    if (!match) return res.status(401).json({ error: 'Identifiants incorrects' });
    const ok = await verifyOtp(admin.email, 'admin_login', String(code).trim());
    if (!ok) return res.status(401).json({ error: 'Code invalide ou expiré' });
    const token = signAdminToken();
    res.json({ token });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

adminRouter.use(requireAdmin);

adminRouter.get('/schools', async (_req, res) => {
  const schools = await School.find().sort({ name: 1 }).lean();
  res.json(schools);
});

adminRouter.post('/schools', async (req, res) => {
  const name = String(req.body?.name ?? '').trim();
  if (!name) {
    return res.status(400).json({ error: 'Nom d’école requis' });
  }
  try {
    const school = await School.create({ name });
    res.status(201).json(school);
  } catch (e) {
    if (e && typeof e === 'object' && 'code' in e && e.code === 11000) {
      return res.status(409).json({ error: 'Cette école existe déjà' });
    }
    throw e;
  }
});

adminRouter.get('/groups', async (_req, res) => {
  const groups = await Group.find()
    .populate('school')
    .sort({ createdAt: -1 })
    .lean();
  const counts = await SubmissionFile.aggregate([
    { $group: { _id: '$group', n: { $sum: 1 } } },
  ]);
  const map = Object.fromEntries(counts.map((c) => [String(c._id), c.n]));
  const threads = await Thread.find().lean();
  const unreadByGroup = Object.fromEntries(threads.map((t) => [String(t.group), t.adminUnreadCount || 0]));
  res.json(
    groups.map((g) => ({
      ...g,
      fileCount: map[String(g._id)] || 0,
      adminUnread: unreadByGroup[String(g._id)] || 0,
    }))
  );
});

adminRouter.get('/groups/:id/submissions.zip', async (req, res) => {
  const group = await Group.findById(req.params.id).populate('school');
  if (!group) return res.status(404).json({ error: 'Groupe introuvable' });
  const files = await SubmissionFile.find({ group: group._id }).lean();
  if (!files.length) {
    return res.status(404).json({ error: 'Aucun fichier pour ce groupe' });
  }
  const present = files.filter((f) => {
    try {
      fs.accessSync(path.join(uploadsRoot, f.relativePath));
      return true;
    } catch {
      return false;
    }
  });
  if (!present.length) {
    return res.status(404).json({ error: 'Fichiers introuvables sur le serveur' });
  }
  const schoolName = group.school?.name || 'ecole';
  const base = sanitize(`${group.groupName}_${schoolName}`.replace(/\s+/g, '_')) || 'soumissions';
  const filename = `${base}.zip`;
  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

  const archive = archiver('zip', { zlib: { level: 9 } });
  archive.on('error', (err) => {
    console.error(err);
    if (!res.headersSent) res.status(500).end();
  });
  archive.pipe(res);

  present.forEach((f, i) => {
    const abs = path.join(uploadsRoot, f.relativePath);
    const entryName = sanitize(f.originalName) || f.storedName;
    archive.file(abs, { name: `${String(i + 1).padStart(2, '0')}_${entryName}` });
  });
  await archive.finalize();
});

adminRouter.get('/threads/:groupId/messages', async (req, res) => {
  let thread = await Thread.findOne({ group: req.params.groupId });
  if (!thread) {
    thread = await Thread.create({ group: req.params.groupId });
  }
  const msgs = await Message.find({ thread: thread._id }).sort({ createdAt: 1 }).lean();
  thread.adminUnreadCount = 0;
  await thread.save();
  res.json({ threadId: thread._id, messages: msgs });
});

adminRouter.post('/threads/:groupId/messages', async (req, res) => {
  const { body } = req.body || {};
  if (!body || !String(body).trim()) {
    return res.status(400).json({ error: 'Message vide' });
  }
  const group = await Group.findById(req.params.groupId);
  if (!group) return res.status(404).json({ error: 'Groupe introuvable' });
  let thread = await Thread.findOne({ group: group._id });
  if (!thread) thread = await Thread.create({ group: group._id });
  const msg = await Message.create({
    thread: thread._id,
    fromRole: 'admin',
    body: String(body).trim(),
  });
  thread.lastMessageAt = new Date();
  thread.groupUnreadCount = (thread.groupUnreadCount || 0) + 1;
  await thread.save();

  try {
    await sendMail({
      to: group.leaderEmail,
      subject: 'Fair Play — nouveau message de l’organisation',
      text: `Bonjour ${group.groupName},\n\nNouveau message sur votre espace Fair Play :\n\n${msg.body}`,
      html: `<p>Bonjour <strong>${group.groupName}</strong>,</p><p>Nouveau message :</p><blockquote style="border-left:3px solid #ccc;padding-left:12px">${msg.body.replace(/</g, '&lt;')}</blockquote><p>Connectez-vous à votre tableau de bord pour répondre.</p>`,
    });
  } catch (e) {
    console.error('Notify mail failed', e);
  }

  res.status(201).json(msg);
});

adminRouter.get('/threads', async (_req, res) => {
  const threads = await Thread.find().populate('group').sort({ lastMessageAt: -1 }).lean();
  res.json(threads);
});
