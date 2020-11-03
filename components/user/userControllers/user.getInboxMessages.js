const User = require("../user.model");

async function getInboxMessages(req, res) {
  try {
    let inboxEmails = await User.find({ _id: req.userData._id }).select('inbox _id');

    return res.status(200).send(inboxEmails);
  } catch (e) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = getInboxMessages;