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
    const existing = await AdminUser.findOne({ email: adminEmail.toLowerCase().trim() });
    if (!existing) {
      const passwordHash = await bcrypt.hash(adminPassword, 12);
      await AdminUser.create({
        email: adminEmail.toLowerCase().trim(),
        passwordHash,
      });
      console.log('Compte admin créé :', adminEmail);
    } else {
      console.log('Compte admin déjà présent :', adminEmail);
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
