const mongoose = require("mongoose");


const inboxMail = new mongoose.Schema({
    mail: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Mail' }], //ref mail
    isRead: { type: Boolean, default: false }
})

module.exports = mongoose.model("inboxMail", inboxMail);