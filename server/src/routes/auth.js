import { Router } from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import rateLimit from 'express-rate-limit';
import { Group } from '../models/Group.js';
import { School } from '../models/School.js';
import { OtpCode } from '../models/OtpCode.js';
import { sendMail } from '../mail.js';
import { generateSixDigitCode } from '../utils/otp.js';
import { signGroupToken } from '../middleware/auth.js';

export const authRouter = Router();

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

authRouter.post('/register', authLimit, async (req, res) => {
  try {
    const { groupName, schoolId, leaderEmail, password, passwordConfirm } = req.body || {};
    if (!groupName || !schoolId || !leaderEmail || !password) {
      return res.status(400).json({ error: 'Champs requis manquants' });
    }
    if (password !== passwordConfirm) {
      return res.status(400).json({ error: 'Les mots de passe ne correspondent pas' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Mot de passe : minimum 8 caractères' });
    }
    if (!mongoose.isValidObjectId(schoolId)) {
      return res.status(400).json({ error: 'École invalide' });
    }
    const school = await School.findById(schoolId);
    if (!school) return res.status(400).json({ error: 'École invalide' });

    const exists = await Group.findOne({ leaderEmail: String(leaderEmail).toLowerCase().trim() });
    if (exists) return res.status(409).json({ error: 'Cet e-mail est déjà utilisé' });

    const passwordHash = await bcrypt.hash(password, 12);
    const group = await Group.create({
      groupName: String(groupName).trim(),
      school: school._id,
      leaderEmail: String(leaderEmail).toLowerCase().trim(),
      passwordHash,
    });

    const token = signGroupToken(group._id);
    res.status(201).json({
      token,
      groupId: group._id,
      message: 'Inscription réussie — accès direct à votre espace.',
    });
  } catch (e) {
    if (e.code === 11000) {
      return res.status(409).json({ error: 'Cet e-mail est déjà utilisé' });
    }
    console.error(e);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

authRouter.post('/login/request-code', authLimit, async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'E-mail et mot de passe requis' });
    }
    const group = await Group.findOne({ leaderEmail: String(email).toLowerCase().trim() });
    if (!group) {
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }
    const match = await bcrypt.compare(password, group.passwordHash);
    if (!match) {
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }
    const code = generateSixDigitCode();
    await storeOtp(group.leaderEmail, 'group_login', code);
    await sendMail({
      to: group.leaderEmail,
      subject: 'Fair Play — code de connexion',
      text: `Votre code Fair Play : ${code}\n\nValide 10 minutes.`,
      html: `<p>Votre code <strong>Fair Play</strong> :</p><p style="font-size:24px;letter-spacing:4px">${code}</p><p>Valide 10 minutes.</p>`,
    });
    res.json({ ok: true, message: 'Un code à 6 chiffres a été envoyé par e-mail.' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Impossible d’envoyer l’e-mail. Vérifiez la configuration SMTP.' });
  }
});

authRouter.post('/login/verify-code', authLimit, async (req, res) => {
  try {
    const { email, password, code } = req.body || {};
    if (!email || !password || !code) {
      return res.status(400).json({ error: 'E-mail, mot de passe et code requis' });
    }
    const group = await Group.findOne({ leaderEmail: String(email).toLowerCase().trim() });
    if (!group) return res.status(401).json({ error: 'Identifiants incorrects' });
    const match = await bcrypt.compare(password, group.passwordHash);
    if (!match) return res.status(401).json({ error: 'Identifiants incorrects' });

    const ok = await verifyOtp(group.leaderEmail, 'group_login', String(code).trim());
    if (!ok) return res.status(401).json({ error: 'Code invalide ou expiré' });

    const token = signGroupToken(group._id);
    res.json({ token, groupId: group._id });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

authRouter.post('/forgot/request-code', authLimit, async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ error: 'E-mail requis' });
    const group = await Group.findOne({ leaderEmail: String(email).toLowerCase().trim() });
    if (!group) {
      return res.json({ ok: true, message: 'Si un compte existe, un code a été envoyé.' });
    }
    const code = generateSixDigitCode();
    await storeOtp(group.leaderEmail, 'group_reset', code);
    await sendMail({
      to: group.leaderEmail,
      subject: 'Fair Play — réinitialisation du mot de passe',
      text: `Votre code : ${code}\n\nValide 10 minutes.`,
      html: `<p>Code de réinitialisation <strong>Fair Play</strong> :</p><p style="font-size:24px;letter-spacing:4px">${code}</p>`,
    });
    res.json({ ok: true, message: 'Si un compte existe, un code a été envoyé.' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Impossible d’envoyer l’e-mail.' });
  }
});

authRouter.post('/forgot/confirm', authLimit, async (req, res) => {
  try {
    const { email, code, newPassword, newPasswordConfirm } = req.body || {};
    if (!email || !code || !newPassword) {
      return res.status(400).json({ error: 'Champs requis manquants' });
    }
    if (newPassword !== newPasswordConfirm) {
      return res.status(400).json({ error: 'Les mots de passe ne correspondent pas' });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'Mot de passe : minimum 8 caractères' });
    }
    const group = await Group.findOne({ leaderEmail: String(email).toLowerCase().trim() });
    if (!group) return res.status(400).json({ error: 'Demande invalide' });
    const ok = await verifyOtp(group.leaderEmail, 'group_reset', String(code).trim());
    if (!ok) return res.status(401).json({ error: 'Code invalide ou expiré' });
    group.passwordHash = await bcrypt.hash(newPassword, 12);
    await group.save();
    res.json({ ok: true, message: 'Mot de passe mis à jour.' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});
