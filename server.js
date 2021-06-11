const express = require("express");
const bodyParser = require("body-parser");
const loginRouter = require("./routers/account.js");

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

app.use(loginRouter);

// app.get("/", (req, res) => {
//   console.log("get it by get", req.headers.origin);
//   console.log(req.query);
//   return res.send(req.query);
// });

app.listen(port, () => {
  console.log(`running at ${port}...`);
});
