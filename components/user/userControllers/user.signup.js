const User = require("../user.model");

const { signup: signupValidationSchema } = require("../user.validation");


async function signup(req, res) {
  try {
    const { error, value } = signupValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message.replace(/"/g, "") });

    let user = await User.findOne().or([ { email: value.email }, { name: value.name } ]);

    if (user) {
      return res.status(409).json({
        message:
        user.email === value.email
            ? "Email already Registered Before"
            : "User name already exists"
      });
    }

    user = await User.create(value);
    const token = user.signTempJWT();
    return res.status(200).send({ token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = signup;