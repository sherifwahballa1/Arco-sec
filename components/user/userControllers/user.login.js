const User = require("../user.model");

const { login: loginValidationSchema } = require("../user.validation");
const securityModule = require("../../../security");


async function login(req, res) {
  try {
    const { error, value } = loginValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message.replace(/"/g, "") });

    const user = await User.findOne({ email: value.email });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const isPasswordValid = await user.isPasswordValid(value.password);
    if (!isPasswordValid) return res.status(401).json({ message: "Invalid email or password" });
    if (!user.isVerified) return res.status(403).json({ tempToken: user.signTempJWT(), message: 'Email address not verified please check email address' });

    securityModule.buildTicket(user, function(token) {
      return res.status(200).json({
        token,
        userData: {
          _id: user._id,
          role: user.role,
          name: user.firstName,
          email: user.email
        }
      });
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = login;