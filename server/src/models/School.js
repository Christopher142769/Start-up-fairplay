import mongoose from 'mongoose';

const schoolSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
  },
  { timestamps: true }
);

export const School = mongoose.model('School', schoolSchema);
