const mongoose = require("mongoose");

const ClientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
    },
    playerId: { type: String, default: null },
    phoneNumber: { type: String, required: true },
    cnicNumber: { type: String, required: true },
    city: { type: String, required: true },
  },
  {
    timestamps: false,
  }
);
module.exports = mongoose.model("Client", ClientSchema);

