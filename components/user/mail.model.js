const mongoose = require("mongoose");


const Tag = new mongoose.Schema({
  name: { type: String, required: true },
  value: { type: String, required: true }
})

const Mail = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  subject: { type: String, required: true },
  body: { type: String, required: true },
  tags: { type: [Tag], default: [] }
})



module.exports = mongoose.model("Mail", Mail);

