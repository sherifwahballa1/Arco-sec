const mongoose = require("mongoose");

const User = require("../user.model");

async function viewProfile(req, res) {
  try {
    let userID;
    if (req.params.id) userID = req.params.id;
    else userID = req.userData._id;

    if (!mongoose.Types.ObjectId.isValid(userID)) return res.status(400).json({ message: "Invalid Team" });
    

    let user = await User.findOne({ _id: userID },
      "-role -password -otpNextResendAt -forgotPasswordNextResetAt -otpRequestCounter -forgotPasswordResetCounter -otp -__v");
    
    if (!user) return res.status(409).json({ error: "Team not found" });

    return res.status(200).send(user);
  } catch (e) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = viewProfile;