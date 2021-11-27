const express = require('express');
const app = express();
app.use(express.json());
const router = express.Router();
var jwt = require("jsonwebtoken");
require('dotenv').config({ path: '../.env' });
const { v4: uuidv4 } = require("uuid");
const { queryExecutor } = require("../Database/queryExecuter");
const { insertQuery, selectQuery } = require("../Database/QueryCreater");
const Upload=require("express-fileupload")
app.use(Upload())

//storing teacher detaisl in database
exports.teacher = async (req, res) => {
  try{
  const {
    fullname,
    username,
    password,
    classes,
    subject
  } = req.body;
  const c = classes
  let first_check = selectQuery('teacher', { username }, [])
  let id = 'mem-' + uuidv4()
  let first_check_result = await queryExecutor(first_check);
  if (first_check_result.rowCount > 0) {
    res.send({ status: false, mssg: "User already exists with this username@gmail.com" });
  }
  else {
    c.map(async (classes) => {
      const query = insertQuery('teacher', {
        id,
        full_name: fullname,
        username,
        password,
        classes,
        subject,
        created_at: "current_timestamp",
        updated_at: "current_timestamp",
      })
      let result = await queryExecutor(query)
    })
    return res.json({ Status: true,message:username })
  }
}catch(err){
  return res.json({ Status: false })
}
}

//storing students details in database
exports.student = async (req, res) => {
  try{
  const {
    fullname,
    username,
    password,
    rollno,
    sclass,
  } = req.body;
  let first_check = selectQuery('student', { username }, [])
  let id = 'mem-' + uuidv4()
  let first_check_result = await queryExecutor(first_check);
  if (first_check_result.rowCount > 0) {
    res.send({ status: false, mssg: "User already exists with this username@gmail.com" });
  }
  else {
    const query = insertQuery('student', {
      id,
      full_name: fullname,
      username,
      password,
      rollno,
      sclass,
      created_at: "current_timestamp",
      updated_at: "current_timestamp",
    })
    let result = await queryExecutor(query)
    console.log("hye")
    return res.json({ Status: true,message:username })
  }
}catch(err){
  return res.json({ Status: false })
}
}

