const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("../../config");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const {Tag, Mail, InboxMail} = require("./mail.model")

const User = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    country: { type: String, default: '' },
    hash: { type: String, default: '' },
    publicKey: { type: Object, default: {} },

    isVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpNextResendAt: { type: Date, default: Date.now },
    otpRequestCounter: { type: Number, default: 0 },
    forgotPasswordNextResetAt: { type: Date, default: Date.now },
    forgotPasswordResetCounter: { type: Number, default: 0 },
    sentMails: {type: [Mail], default: []},
    inbox: {type: [InboxMail], default: []},
    role: { type: String, default: "user" }
  },
  { usePushEach: true }
); /// to make the array push available in DB

User.methods.signTempJWT = function() {
  return jwt.sign({ _id: this._id }, config.tempTokenSecret, {
    expiresIn: `${config.tempTokenDurationInHours}h`
  });
};

// check Password Validation
User.methods.isPasswordValid = async function(password) {
  return await bcrypt.compare(password, this.password);
};

User.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

User.methods.updateOtp = function () {
	let blockTimeInMinutes = 1;
  
	// block user for 1h if he made 5 requests
	// otherwise block user for 1 minute
	if (this.otpRequestCounter === 4) {
	  blockTimeInMinutes = 60;
	  this.otpRequestCounter = -1;
	}
	// generate 6-digits OTP
	const otp = Math.floor(100000 + Math.random() * 900000);
	// add 60 seconds to next resend time
	const nextResendTime = new Date().getTime() + blockTimeInMinutes * 600;
  
	this.otp = otp;
	this.otpNextResendAt = new Date(nextResendTime);
	this.otpRequestCounter++;
  };


  User.methods.updateResetPasswordCounter = function () {
  let blockTimeInMinutes = 3;

  // block user for 3h if he made 3 requests
  // otherwise block user for 3 minutes
  if (this.forgotPasswordResetCounter === 2) {
    blockTimeInMinutes = 3 * 24 * 60; // 3Days
    this.forgotPasswordResetCounter = -1;
  }

  const nextResendTime = new Date().getTime() + blockTimeInMinutes * 600;

  this.forgotPasswordNextResetAt = new Date(nextResendTime);
  this.forgotPasswordResetCounter++;
};

module.exports = mongoose.model("User", User);