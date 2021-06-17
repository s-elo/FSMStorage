const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const accountRouter = require("./routers/account.js");
const dataRouter = require("./routers/data.js");

const app = express();

const port = 8089;

app.use(bodyParser.urlencoded({ limit: "50mb", extended: false }));
app.use(bodyParser.json({ limit: "50mb" }));

// Cross-Origin Resource Sharing
app.all("*", (req, res, next) => {
  // console.log(req.headers.origin);
  // localhost和127.0.0.1are different...
  res.header("Access-Control-Allow-Origin", `http://localhost:3080`);
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, DELETE, PUT");
  // for token header
  res.header("Access-Control-Allow-Headers", "authorization");
  next();
});

app.use(accountRouter);
app.use(dataRouter);

// app.get("/", (req, res) => {
//   console.log("get it by get", req.headers.origin);
//   console.log(req.query);
//   return res.send(req.query);
// });

mongoose.connect("mongodb://localhost/FSMUsers", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // avoid the warning when using findOneAndUpdate
  useFindAndModify: false,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("connected the mongoDB");
  app.listen(port, () => {
    console.log(`running at ${port}...`);
  });
});
