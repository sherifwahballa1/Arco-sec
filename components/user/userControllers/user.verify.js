const User = require("../user.model");

const { otpSchema: otpValidationSchema } = require("../user.validation");
const securityModule = require("../../../security");


async function verify(req, res) {
  try {
    // validate all data felids
    const { error, value } = otpValidationSchema.validate(req.body);
    // there are error in the validation data not valid
    if (error) return res.status(400).json({ message: error.message.replace(/"/g, "") });

    const user = await User.findOne( { _id: req.userData._id },
      "-otpNextResendAt -__v -createdAt -updatedAt -forgotPasswordNextResetAt -forgotPasswordResetCounter"
    );
    // if otp == the code sent
    if (user.otp !== value.otp) {
      return res.status(400).json({ message: "Invalid code" });
    }

    user.isVerified = true;
    user.otpRequestCounter = 0;
    await user.save();

    // remove data from user
    user.otpRequestCounter = user.password = user.otp = user.updatedAt = undefined;
    securityModule.buildTicket(user, function(token) {
      return res.status(200).json({ token, userData: user });
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = verify;