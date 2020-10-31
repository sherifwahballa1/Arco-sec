const User = require("../user.model");

async function getEmails(req, res) {
  try {
    const searchRegexExp = new RegExp(req.body.email, 'gi');
    let userEmails = await User.find({ email: searchRegexExp }).select('email -_id').limit(10);

    return res.status(200).send(userEmails);
  } catch (e) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = getEmails;