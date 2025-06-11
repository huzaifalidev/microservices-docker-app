const Client = require("../Models/Client");
const OTP = require("../Models/OTP");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");

const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

const sendOTPEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset OTP",
    text: `Your OTP for password reset is: ${otp}. It will expire in 5 minutes.`,
  };
  await transporter.sendMail(mailOptions);
};

const sendResetOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const client = await Client.findOne({ email });

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    const otp = generateOTP();
    await OTP.deleteMany({ email });
    await new OTP({ email, otp }).save();
    await sendOTPEmail(email, otp);
    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
const verifyResetOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    console.log(email, otp);

    const otpRecord = await OTP.findOne({ email, otp });

    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    otpRecord.isVerified = true;
    await otpRecord.save();

    res.status(200).json({
      message: "OTP verified successfully. You can now reset your password.",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const otpRecord = await OTP.findOne({ email, isVerified: true });

    if (!otpRecord) {
      return res
        .status(400)
        .json({ message: "OTP not verified. Please verify OTP first." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await Client.updateOne({ email }, { $set: { password: hashedPassword } });
    await OTP.deleteMany({ email });

    res.status(200).json({
      message:
        "Password reset successfully. You can now log in with your new password.",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

module.exports = { sendResetOTP, verifyResetOTP, resetPassword };
