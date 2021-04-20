const jwt = require("jsonwebtoken");

const privateKey = "superli";

exports.generateToken = ({ accountName, _id }) => {
  const token = jwt.sign(
    {
      accountName,
      _id,
    },
    privateKey,
    { expiresIn: "1h" }
  );

  return token;
};

exports.verifyToken = (token) => {
  try {
    const decode = jwt.verify(token, privateKey);
    return decode;
  } catch (err) {
    return "error";
  }
};
