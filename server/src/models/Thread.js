import mongoose from 'mongoose';

const threadSchema = new mongoose.Schema(
  {
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true, unique: true },
    lastMessageAt: { type: Date, default: Date.now },
    groupUnreadCount: { type: Number, default: 0 },
    adminUnreadCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Thread = mongoose.model('Thread', threadSchema);
