import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    codeHash: { type: String, required: true },
    purpose: {
      type: String,
      enum: ['group_login', 'group_reset', 'admin_login'],
      required: true,
    },
    expiresAt: { type: Date, required: true },
    consumed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

otpSchema.index({ email: 1, purpose: 1, consumed: 1 });

export const OtpCode = mongoose.model('OtpCode', otpSchema);
