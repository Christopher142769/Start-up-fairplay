import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema(
  {
    groupName: { type: String, required: true, trim: true },
    school: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
    leaderEmail: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

groupSchema.index({ groupName: 1, school: 1 });

export const Group = mongoose.model('Group', groupSchema);
