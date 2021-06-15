const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  accountName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  data: [],
  userStatus: {
    type: Number,
    // 0: normal; 1: VIP
    enum: [0, 1],
    default: 0,
  },
});

module.exports = mongoose.model("User", userSchema);
