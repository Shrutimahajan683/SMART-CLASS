const express = require('express');
const app = express();
app.use(express.json());
const router = express.Router();
var jwt = require("jsonwebtoken");
require('dotenv').config({ path: '../.env' });
const { v4: uuidv4 } = require("uuid");
const { queryExecutor } = require("../Database/queryExecuter");
const { insertQuery, selectQuery } = require("../Database/QueryCreater");
const {
    ObjecttoArrayConverter,
} = require("../Reusable functions/ObjecttoArrayConverter");
const { jwtVerifier } = require("../Reusable functions/jwtVerifier");

//storing topic details for discussion in database
exports.submittopic = async (req, res) => {
    try{
    console.log(req.body);
    const {
        title,
        description,
        token,
        role
    } = req.body;
    let mem = jwt.verify(token, process.env.PRIVATEKEY);
    console.log(title);
    const sid=mem.id;
    let query=``;
    if(role=="student")
     query=`select full_name,sclass from student where id='${sid}'`;
    else
     query=`select full_name from teacher where id='${sid}'`;
    let result = await queryExecutor(query)
    console.log(result);
    let sclass=''
    if(role=="student")
    sclass=result.rows[0].sclass;
    else
    sclass=req.body.sclass;
    let id =uuidv4()
    const d=new Date();
    const newdate=d.getDate()+'-'+(d.getMonth()+1)+'-'+d.getFullYear()
    console.log(sclass);
    console.log(newdate);
    const query1 = insertQuery('topics', {
        id,
        sclass,
        author:result.rows[0].full_name,
        title,
        description,
        created_at: newdate
      })
      let result1 = await queryExecutor(query1)
      console.log(result1);
      res.send({status:true});
    }
    catch(err){
        console.log(err);
    }
}

//fecting topic details from backend 
exports.fetchtopics = async (req, res) => {
    try{
    const {
        token,
        role,
    } = req.body
    let sclass=0;
    let mem = jwt.verify(token, process.env.PRIVATEKEY);
    const sid=mem.id;
    if(role=="teacher")
    sclass=req.body.sclass;
    let query=``;
    if(role=="student")
     {query=`select sclass from student where id='${sid}'`;
     let result = await queryExecutor(query);
     sclass=result.rows[0].sclass;
}
   const query1=`select * from topics where sclass='${sclass}'`;
   let result1 = await queryExecutor(query1);
   res.send({status:true,data:result1.rows});
}
catch(err){
    console.log(err);
}
}

//fetching posts from backend
exports.fetchposts = async (req, res) => {
    try{
    const id=req.body.id;
    const query=`select * from posts where topic_id='${id}'`;
    let result = await queryExecutor(query);
    console.log(result);
    res.send({status:true,data:result.rows});
    }
    catch(err){
        console.log(err);
    }
}

//storing posts of topics in backend
exports.submitposts = async (req, res) => {
    try{
    const {
        topic_id,
        token,
        role,
        description,
        parent
    } = req.body
    let mem = jwt.verify(token, process.env.PRIVATEKEY);
    console.log(parent)
    if(parent!="")
    console.log(parent)
    const sid=mem.id;
    let query=``;
    let id =uuidv4();
    if(role=="student")
   query=`select full_name from student where id='${sid}'`
   else
   query=`select full_name from teacher where id='${sid}'`
   let result = await queryExecutor(query);
   const name=result.rows[0].full_name;
   const d=new Date();
   const newdate=d.getDate()+'-'+(d.getMonth()+1)+'-'+d.getFullYear()
   const query1 = insertQuery('posts', {
    topic_id,
    id,
    author:name,
    description,
    parent,
    created_at: newdate
  })
  let result1 = await queryExecutor(query1);
  res.send({status:true});
}catch(err){
    console.log(err);
}
}