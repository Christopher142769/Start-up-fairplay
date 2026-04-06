import mongoose from 'mongoose';

const submissionFileSchema = new mongoose.Schema(
  {
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
    originalName: { type: String, required: true },
    storedName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    relativePath: { type: String, required: true },
  },
  { timestamps: true }
);

submissionFileSchema.index({ group: 1 });

export const SubmissionFile = mongoose.model('SubmissionFile', submissionFileSchema);
