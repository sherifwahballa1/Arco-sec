const User = require("../user.model");

async function getSentMessages(req, res) {
  try {
    let sentEmails = await User.find({ _id: req.userData._id }).populate({ path: 'sentMails', populate: { path: 'sender', model: 'User' }}).select('sentMails');

    return res.status(200).send(sentEmails);
  } catch (e) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = getSentMessages;