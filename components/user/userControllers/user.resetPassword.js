const User = require("../user.model");

const { resetPassword: resetPasswordValidationSchema } = require("../user.validation");


async function resetPassword (req, res, next) {
  try {
    const { error, value } = resetPasswordValidationSchema.validate(req.body);
    
    if (error) return res.status(400).json({ message: error.message.replace(/"/g, '') });
    
    const user = await User.findById(req.userData._id);
    if (!user) return res.status(409).json({ message: 'Team not found' });

    user.password = value.password;
    user.otpRequestCounter = 0;
    await user.save();
    return res.status(200).json({ message: 'Password Reset Successfully'});
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = resetPassword;