const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: {type: String,
    unique:true,
  },
  password: String,

  role: {
    type: String,
    enum: ["Admin", "User"],
    default: "User",
  },

  status: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active",
  },
});

module.exports = mongoose.model("User", userSchema);
