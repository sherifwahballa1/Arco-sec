const User = require("../mail.model");

// const { addMail: email } = require("../user.validation");


async function createMail(req, res) {
  try {
    mail = await User.create(res.body);
    return res.status(200).send({ mailId: mail._id });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}


module.exports = createMail;