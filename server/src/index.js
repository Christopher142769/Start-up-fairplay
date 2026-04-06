import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { connectDb } from './db.js';
import { schoolsRouter } from './routes/schools.js';
import { authRouter } from './routes/auth.js';
import { teamRouter } from './routes/team.js';
import { adminRouter } from './routes/admin.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsRoot = path.join(__dirname, '../uploads');
fs.mkdirSync(path.join(uploadsRoot, 'groups'), { recursive: true });

const app = express();
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || true,
    credentials: true,
  })
);
app.use(express.json({ limit: '2mb' }));

app.use('/api/schools', schoolsRouter);
app.use('/api/auth', authRouter);
app.use('/api/team', teamRouter);
app.use('/api/admin', adminRouter);

app.get('/api/health', (_req, res) => res.json({ ok: true }));

const port = Number(process.env.PORT || 4000);

connectDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`Fair Play API → http://localhost:${port}`);
    });
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
