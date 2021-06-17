const express = require("express");
const Users = require("../models/users.js");
const Datas = require("../models/stateDiagram.js");

const md5 = require("blueimp-md5");
const jwt = require("../authorization/tokenHanler.js");

const router = express.Router();

router.post("/save", async (req, res) => {
  // console.log(req.body);
  const token = req.headers.authorization;

  const user = await verifyUser(token);

  const { accountName, data } = user;

  const { entityName } = JSON.parse(req.body.data);

  // see if the entityName has been used repeatly
  if (data.includes(entityName)) {
    return res.status(400).json({
      errStatus: 2,
      message: "The entityName has already been existed",
    });
  }

  // save the data
  try {
    await new Datas({
      accountName,
      entityName,
      data: req.body.data,
    }).save();
  } catch {
    return res.status(500).json({
      errStatus: 1,
      message: "Cannot save, something wrong here~",
    });
  }

  // update the datas of the corresponding account
  data.push(entityName);

  try {
    await Users.findOneAndUpdate({ accountName }, { data });
  } catch {
    return res.status(500).json({
      errStatus: 1,
      message: "Cannot update the account, something wrong here~",
    });
  }

  return res.send({
    errStatus: 0,
    message: "save successfully~",
  });
});

async function verifyUser(token) {
  const verifyRes = jwt.verifyToken(token);

  if (verifyRes === "error") {
    return res.status(403).json({
      errStatus: 1,
      message: "token has expired, please login again",
    });
  }

  const user = await Users.findOne({
    _id: verifyRes._id,
  }).catch(() => {
    errHandler();
  });

  if (!user) {
    return res.status(403).json({ errStatus: 2, message: "no such user" });
  }

  return user;
}

module.exports = router;
