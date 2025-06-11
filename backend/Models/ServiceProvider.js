const mongoose = require("mongoose");
const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  token: { type: String, default: null },
  isVerified: { type: Boolean, default: false },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300,
  },
});

const ServiceProviderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    cnicNumber: { type: String, required: true },
    otp: otpSchema,
    profilePicture: {
      type: String,
    },
    city: { type: String, required: false },
    playerId: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model("ServiceProvider", ServiceProviderSchema);
