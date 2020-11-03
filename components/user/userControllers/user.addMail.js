const User = require('../user.model');
const Mail = require("../mail.model");

async function createMail(req, res) {
  let body = req.body;

  let mailForm = {
    sender: req.userData._id,
    subject: body.subject,
    body: body.body,
    tags: body.documentTags
  }
  try {

    let receiverId = await User.findOne({ email: body.receipeintEmail }).select('_id')

    mailForm['receiver'] = receiverId._id;

    //create mail in mail model

    let mail = await Mail.create(mailForm);

    updateSender = await User.findOneAndUpdate({ _id: mail.sender }, {
      $push: {
        sentMails: mail,
      }
    }, { new: true });


    updaterReciver = await User.findOneAndUpdate({ _id: mail.receiver }, {
      $push: {
        inbox: mail
      }
    }, { new: true })

    let mailID = mail._id;
    let receiverID =  mail.receiver;

    return res.status(200).send({ mailID, receiverID });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}


module.exports = createMail;


function setMail(s, mail) {
  if (s === 'sender') {
    mail['isRead'] = true;
  } else {
      mail['isRead'] = false;
  }
  return mail;
}