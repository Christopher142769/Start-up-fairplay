import { Router } from 'express';
import { School } from '../models/School.js';

export const schoolsRouter = Router();

schoolsRouter.get('/', async (_req, res) => {
  const schools = await School.find().sort({ name: 1 }).lean();
  res.json(schools);
});
