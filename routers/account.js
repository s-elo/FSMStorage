const express = require("express");
const Users = require("../models/users.js");
const md5 = require("blueimp-md5");
const jwt = require("../authorization/tokenHanler.js");

const router = express.Router();

router.post("/register", async (req, res) => {
  //   console.log("get it by post", req.headers.origin);
  // console.log(req.body);
  const { accountName, email, password } = req.body;

  // see if the user has already exsit
  const userArr = await Users.find({
    $or: [{ accountName: accountName }, { email: email }],
  }).catch(() => {
    errHandler();
  });

  // console.log(userArr);
  if (userArr.length !== 0) {
    return res.send({
      message: "can not use this email or account name",
      errStatus: 1,
    });
  }

  const encypedPassword = md5(password);

  new Users({ ...req.body, password: encypedPassword }).save((err) => {
    if (err) {
      errHandler();
    }

    return res.send({
      message: "account created successfully!",
      errStatus: 0,
      ...req.body,
    });
  });
});

router.post("/login", async (req, res) => {
  console.log(req.body);
  const { accountName, password } = req.body;

  const user = await Users.findOne({
    accountName,
  }).catch(() => {
    errHandler();
  });

  // console.losg(user);
  // send a token if password is correct
  if (user && md5(password) === user.password) {
    // add token
    const token = jwt.generateToken(user);
    return res.send({ token, status: 0, message: "login successfully" });
  } else {
    return res
      .stauts(400)
      .send({ status: 1, message: "wrong password or account" });
  }
});

router.get("/userInfo", async (req, res) => {});

function errHandler() {
  return res.status(500).json({
    errStatus: 2,
  });
}

module.exports = router;
