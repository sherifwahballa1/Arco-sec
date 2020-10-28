const Email = require('./../../../modules/email');
const User = require("../user.model");

const { forgotPassword: forgotPasswordValidationSchema } = require("../user.validation");

async function forgotPassword (req, res, next) {
  try {
    const { error, value } = forgotPasswordValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message.replace(/"/g, '') });
    
    const user = await User.findOne().or([{ email: value.email }, { name: value.email }]);

    if (!user) return res.status(409).send({ message: 'Team not found, enter a valid email' });
    
    if (user.forgotPasswordNextResetAt > Date.now())  return res.status(400).send({ message: 'Try again in a few minutes' });
  
    if (user.otpNextResendAt > Date.now()) return res.status(400).send({ message: 'Try again in a few minutes' });

    user.updateOtp();
    user.updateResetPasswordCounter();
    await user.save();

    await new Email(user, user.otp).sendPasswordReset();
  
    const token = user.signTempJWT();
    return res.status(200).send({ token, email: value.email });
  } catch (error) {
    return res.status(500).send({ message: 'Internal server error' });
  }
}

module.exports = forgotPassword;