const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/FSMUsers", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("connected the mongoDB");
});

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
  status: {
    type: Number,
    // 0: normal; 1: VIP
    enum: [0, 1],
    default: 0,
  },
});

module.exports = mongoose.model("User", userSchema);
