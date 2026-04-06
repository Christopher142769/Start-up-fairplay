import jwt from 'jsonwebtoken';
import { Group } from '../models/Group.js';

function jwtSecret() {
  const s = process.env.JWT_SECRET;
  if (!s || s.length < 16) {
    throw new Error('JWT_SECRET must be set (min 16 chars)');
  }
  return s;
}

export function signGroupToken(groupId) {
  return jwt.sign({ role: 'group', sub: String(groupId) }, jwtSecret(), { expiresIn: '7d' });
}

export function signAdminToken() {
  return jwt.sign({ role: 'admin' }, jwtSecret(), { expiresIn: '12h' });
}

export async function requireGroup(req, res, next) {
  try {
    const header = req.headers.authorization;
    const token = header?.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Non autorisé' });
    const payload = jwt.verify(token, jwtSecret());
    if (payload.role !== 'group' || !payload.sub) {
      return res.status(401).json({ error: 'Non autorisé' });
    }
    const group = await Group.findById(payload.sub).populate('school');
    if (!group) return res.status(401).json({ error: 'Groupe introuvable' });
    req.group = group;
    next();
  } catch {
    return res.status(401).json({ error: 'Session invalide' });
  }
}

export function requireAdmin(req, res, next) {
  try {
    const header = req.headers.authorization;
    const token = header?.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Non autorisé' });
    const payload = jwt.verify(token, jwtSecret());
    if (payload.role !== 'admin') {
      return res.status(401).json({ error: 'Non autorisé' });
    }
    next();
  } catch {
    return res.status(401).json({ error: 'Session invalide' });
  }
}
