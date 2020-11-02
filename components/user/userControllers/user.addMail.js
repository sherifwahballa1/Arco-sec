// const { Mail, Tag, inboxMail } = require("../mail.model");
const User = require('../user.model');
const Mail = require("../mail.model");
const Tag = require("../mail.model");
const inboxMail = require("../mail.model");

// const { addMail: email } = require("../user.validation");

async function createMail(req, res) {
  let body = req.body;
  console.log(body);
  // let sender = req.userData._id
  // body = {
  //   receipeintEmail: 'rameznoshy@gmail.com',
  //   subject: 'fddsf',
  //   body: 'dsfsd',
  //   documentTags: [{ name: 'sdfs', value: 'sdfs' }, { name: 'sfs', value: 'sdfs' }],
  //   ipfsHash: 'QmcWYBVxBVYGjjeYXFDfgUb2XLfBKxpEZphdHRYYLBQs1e'
  // }
  // mail = {
  //   sender: { type: String, required: true },
  //   subject: { type: String, required: true },
  //   body: { type: String, required: true },
  //   tags: { type: [Tag], default: [] }
  // }
  let mail = {
    // sender: req.userData._id,
    sender: "safdgdid",
    subject: body.subject,
    body: body.body,
    tags: body.documentTags
  }
  try {
    mail = await Mail.create(mail);
    receiverId=await User.findOne({email:})
    mail = await User.findOneAndUpdate({ _id: mail.sender },{

    },{new:true})
    return res.status(200).send({ mail });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}


module.exports = createMail;