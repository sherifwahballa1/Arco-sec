const User = require("../user.model");

const { updatePassword: updatePasswordValidationSchema } = require("../user.validation");

async function updatePassword(req, res, next) {
  try {
    const { error, value } = updatePasswordValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message.replace(/"/g, "") });
    

    const team = await User.findById(req.userData._id);
    if (!user) return res.status(401).send({ message: "Unauthorized Team Please Login" });
    const isPasswordValid = await user.isPasswordValid(req.body.oldPassword);
    if (!isPasswordValid) return res.status(409).send({ message: "Old Password Incorrect" });
    

    if (value.oldPassword === value.newPassword) {
      return res.status(409).send({ message: "New password must not be the same as old password" });
    }

    user.password = value.newPassword;
    await user.save();
    return res.status(200).send({ message: "Password Updated Successfully" });
  } catch (error) {
    return res.status(500).send({ message: "Internal server error" });
  }
}

module.exports = updatePassword;