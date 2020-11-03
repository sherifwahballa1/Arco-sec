const Mail = require("../mail.model");

async function getMailById(req, res) {
  try {
    let mailId = req.params.mailId;
    let email = await Mail.findById(mailId);

    return res.status(200).send(email);
  } catch (e) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = getMailById;