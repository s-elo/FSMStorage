const express = require("express");
const Users = require("../models/users.js");
const Datas = require("../models/stateDiagram.js");

// const md5 = require("blueimp-md5");
const jwt = require("../authorization/tokenHanler.js");

const router = express.Router();

router.post("/save", async (req, res) => {
  // console.log(req.body);
  const token = req.headers.authorization;

  const user = await verifyUser(token);

  const { accountName, data } = user;

  const { entityName } = JSON.parse(req.body.data);

  // update if the entityName has been used
  if (data.includes(entityName)) {
    try {
      await Datas.findOneAndUpdate(
        { entityName, accountName },
        { data: req.body.data }
      );
    } catch {
      return res.status(500).json({
        errStatus: 1,
        message: "Cannot save, something wrong here~",
      });
    }
  } else {
    // save the data if the entityName has not been used
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
  }

  return res.send({
    errStatus: 0,
    message: "save successfully~",
  });
});

router.post("/delete", async (req, res) => {
  // console.log(req.body);
  // delete according to the entityName and the accountName
  const { entityName } = req.body;

  const token = req.headers.authorization;

  const user = await verifyUser(token);

  const { accountName, data } = user;

  try {
    await Datas.deleteOne({ accountName, entityName });

    const newData = data.filter((v) => v !== entityName);

    await Users.findOneAndUpdate({ accountName }, { data: newData });

    return res.json({
      errStatus: 0,
      message: "delete successfully~",
    });
  } catch {
    return res.status(500).json({
      errStatus: 1,
      message: "Cannot delete the FSM, please try again~",
    });
  }
});

router.get("/getFSM", async (req, res) => {
  const { entityName } = req.query;

  const token = req.headers.authorization;

  const user = await verifyUser(token);

  const { accountName } = user;

  try {
    const fsm = await Datas.findOne({ accountName, entityName });

    const { data } = fsm;

    return res.send({ data, errStatus: 0 });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ errStatus: 2, message: "something wrong in server" });
  }
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
