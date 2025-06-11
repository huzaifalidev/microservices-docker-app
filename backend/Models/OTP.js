const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300,
  },
  verifiedAt: { type: Date, default: null },
});

otpSchema.pre("save", function (next) {
  if (this.isVerified) {
    this.verifiedAt = new Date();
    this.createdAt = new Date(Date.now() + 60 * 100);
  }
  next();
});

const OTP = mongoose.model("OTP", otpSchema);
module.exports = OTP;
