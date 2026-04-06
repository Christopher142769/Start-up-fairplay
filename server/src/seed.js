import 'dotenv/config';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { School } from './models/School.js';
import { AdminUser } from './models/AdminUser.js';

const defaultSchools = [
  'HEC Paris',
  'Sciences Po',
  'Polytechnique',
  'Université Paris-Saclay',
  'ESSEC Business School',
  'EDHEC',
  'EM Lyon',
  'Université de Bordeaux',
  'Université Lyon 1',
  'Autre école',
];

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI manquant dans .env');
    process.exit(1);
  }
  await mongoose.connect(uri);

  for (const name of defaultSchools) {
    await School.updateOne({ name }, { $setOnInsert: { name } }, { upsert: true });
  }
  console.log('Écoles : OK');

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (adminEmail && adminPassword) {
    const emailNorm = adminEmail.toLowerCase().trim();
    const existing = await AdminUser.findOne({ email: emailNorm });
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    const forceReset = String(process.env.ADMIN_RESET_PASSWORD || '').toLowerCase() === 'true';

    if (!existing) {
      await AdminUser.create({
        email: emailNorm,
        passwordHash,
      });
      console.log('Compte admin créé :', emailNorm);
    } else if (forceReset) {
      existing.passwordHash = passwordHash;
      await existing.save();
      console.log('Mot de passe admin mis à jour pour :', emailNorm);
    } else {
      console.log('Compte admin déjà présent :', emailNorm);
      console.log(
        '(Le mot de passe en base ne change pas automatiquement. Pour le remplacer : ADMIN_RESET_PASSWORD=true npm run seed)'
      );
    }
  } else {
    console.log('ADMIN_EMAIL / ADMIN_PASSWORD non définis — pas de création admin.');
  }

  await mongoose.disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
