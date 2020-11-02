const mongoose = require("mongoose");

const Tag = new mongoose.Schema({
  name : { type: String, required: true },
  value : { type: String, required: true }
})

const Mail = new mongoose.Schema({
  sender : { type: String, required: true },
  subject : { type: String, required: true },
  tags : { type: [Tag], default: [] }
})

const OutboxMail = new mongoose.Schema({
  mail: { type: Mail, required: true },
  isRead: { type: Boolean, default: false }
})

module.exports = {
  Tag, OutboxMail, Mail
}