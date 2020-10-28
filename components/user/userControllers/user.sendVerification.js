const Email = require('./../../../modules/email');
const User = require("../user.model");


async function sendVerification(req, res) {
  try {
    const user = await User.findById(req.userData._id);
    if (user && user.isVerified) return res.status(401).json({ message: "User is already verified" });

    // if otp next resend time didn't expire
    let timeInSeconds = (user.otpNextResendAt - new Date()) / 1000;
    const responseBody = {
      timeInSeconds,
      email: user.email,
      message: "To update email or resend verification please try again later"
    };

    if (user.otpNextResendAt > Date.now()) return res.status(400).send(responseBody);

    user.updateOtp();
    await user.save();

    await new Email(user, user.otp).sendWelcome();
    timeInSeconds = (user.otpNextResendAt - new Date()) / 1000;
    responseBody.message = "Please Check your Email";

    responseBody.timeInSeconds = timeInSeconds;

    return res.status(200).send(responseBody);
  } catch (error) {
    return res.status(500).send({ message: "Internal server error try again later" });
  }
}

module.exports = sendVerification;