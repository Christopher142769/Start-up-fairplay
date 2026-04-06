import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    thread: { type: mongoose.Schema.Types.ObjectId, ref: 'Thread', required: true },
    fromRole: { type: String, enum: ['admin', 'group'], required: true },
    body: { type: String, required: true, trim: true, maxlength: 8000 },
  },
  { timestamps: true }
);

messageSchema.index({ thread: 1, createdAt: 1 });

export const Message = mongoose.model('Message', messageSchema);
