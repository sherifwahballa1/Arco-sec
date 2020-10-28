const User = require("../user.model");

const { userNameSchema: updateNameValidationSchema } = require("../user.validation");

async function updateName(req, res, next) {
  try {
    const { error, value } = updateNameValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message.replace(/"/g, "") });
    

    const user = await User.findById(req.userData._id);
    if (!user) return res.status(401).json({ message: "Unauthorized Team Please Login" });
    
    let foundName = await User.findOne({ name: value.name, _id: { $ne: req.userData._id } });
    if (foundName) {
        return res.status(409).json({ message: "This Team Name Used Before.." });
    }

    user.name = value.name;
    await user.save();
    return res.status(200).json({ message: "Team Name Updated Successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = updateName;