const express = require("express");
const Users = require("../models/users.js");
const md5 = require("blueimp-md5");

const router = express.Router();

function errHandler() {
  return res.status(500).json({
    errStatus: 2,
  });
}

router.post("/register", async (req, res) => {
  //   console.log("get it by post", req.headers.origin);
  console.log(req.body);
  const { accountName, email, password } = req.body;

  // see if the user has already exsit
  const userArr = await Users.find({
    $or: [{ accountName: accountName }, { email: email }],
  }).catch(() => {
    errHandler();
  });

  console.log(userArr);
  if (userArr.length !== 0) {
    return res.send({ errStatus: 1 });
  }

  const encypedPassword = md5(password);

  new Users(req.body).save((err) => {
    if (err) {
      errHandler();
    }

    return res.send({ ...req.body, errStatus: 0, password: encypedPassword });
  });
});

module.exports = router;
