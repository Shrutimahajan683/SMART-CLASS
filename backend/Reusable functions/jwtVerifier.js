require("dotenv").config({path:'../.env'});
var jwt = require("jsonwebtoken");

exports.jwtVerifier = (token) => {
  let id = {};
  try {
    id = jwt.verify(token, process.env.PRIVATEKEY);
  } catch (e) {
    console.log(e);
  }
  return id;
};
