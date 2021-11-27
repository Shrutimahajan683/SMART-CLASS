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
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

//uploading assignments in databse
exports.assignment = async (req, res) => {
    try{
    let id =uuidv4()
    const {
        token,
        assignmentname,
        path,
        sclass,
    } = req.body
    let mem = jwt.verify(token, process.env.PRIVATEKEY);
    const tid=mem.id
    const filepath=`http://localhost:3000/image/${path}`
    const query = `select subject from teacher where id='${tid}'`;
    let getresult = await queryExecutor(query);
    const subject=getresult.rows[0].subject;
    const query1 = insertQuery('files', {
        id,
        assignmentname,
        filepath,
        subject,
        sclass,
        created_at: "current_timestamp",
        updated_at: "current_timestamp"
      })
      let result = await queryExecutor(query1)
      res.send({ status: true})
    }
    catch(err){
        console.log(err);
    }
}

//fetching student assignments from database
exports.studentassignment = async (req, res) => {
    try{
    const token=req.body.token
    const subject=req.body.subject;
    let mem = jwt.verify(token, process.env.PRIVATEKEY);
    const sid=mem.id
    const query = `select full_name,rollno,sclass from student where id='${sid}'`;
    let getresult = await queryExecutor(query);
    const sclass=getresult.rows[0].sclass;
    const query1 = `select * from files where subject='${subject}' and sclass='${sclass}' and valid='f'`;
    let getresult1 = await queryExecutor(query1);
    res.send({ status: true,data:getresult1.rows});
    }
    catch(err){
        console.log(err);
    }
}

//fetching assignments from backend
exports.studentsubmittedassignment=async(req,res)=>{
    try{
    const token=req.body.token
    const subject=req.body.subject;
    let mem = jwt.verify(token, process.env.PRIVATEKEY);
    const sid=mem.id
    const query = `select full_name,rollno,sclass from student where id='${sid}'`;
    let getresult = await queryExecutor(query);
    const sclass=getresult.rows[0].sclass;
    const query1 = `select filepath,id,assignmentname from files where subject='${subject}' and sclass='${sclass}' and valid='t'`;
    let getresult1 = await queryExecutor(query1);
    const obj=getresult1.rows; 
    let result=[];
    for(let c=0;c<obj.length;c++){
    const query2 = `select marks,filepath from submittedfiles where id='${obj[c].id}'`;
    let getresult2 = await queryExecutor(query2);
    let obj1=getresult2.rows[0];
    obj1['assignmentpath']=obj[c].filepath;
    obj1['assignmentname']=obj[c].assignmentname;
    result.push(obj1);
    }
    res.send({ status: true,data:result});
}catch(err){
    console.log(err);
}
}

//fetching uploaded assignments by teacher from database
exports.submitassignment = async (req, res) => {
    try{
    const id=req.body.id;
    const query = `select * from files where id='${id}' `;
    let getresult = await queryExecutor(query);
    res.send({ status: true,data:getresult.rows});
    }
    catch(err){
        console.log(err);
    }
}

exports.submission = async (req, res) => {
    try{
    const {
        id,
        token,
        assignmentname,
        path,
    } = req.body;
    const filepath=`http://localhost:3000/image/${path}`
    let mem = jwt.verify(token, process.env.PRIVATEKEY);
    const sid=mem.id
    const query = `select full_name,rollno from student where id='${sid}'`;
    let getresult = await queryExecutor(query);
    const query1 = insertQuery('submittedfiles', {
        id,
        assignmentname,
        filepath,
        full_name:getresult.rows[0].full_name,
        rollno:getresult.rows[0].rollno,
        created_at: "current_timestamp",
        updated_at: "current_timestamp"
      })
      let result = await queryExecutor(query1)
      res.send({ status: true})
    }
    catch(err){
        console.log(err);
    }
}

exports.fetchassignments = async (req, res) => {
    try{
    const {
        token,
        sclass
    } = req.body;
    let mem = jwt.verify(token, process.env.PRIVATEKEY);
    const tid=mem.id
    const query = `select subject from teacher where id='${tid}'`;
    let getresult = await queryExecutor(query);
    const query1 = `select * from files where sclass='${sclass}' and subject='${getresult.rows[0].subject}'`;
    let getresult1 = await queryExecutor(query1);
    res.send({ status: true,data:getresult1.rows});
}
catch(err){
    console.log(err);
}
}

exports.fetchsubmissions = async (req, res) => {
    try{
    const {
        assignment
    } = req.body;
    const query = `select * from submittedfiles where id='${assignment}'`;
    let getresult = await queryExecutor(query);
    res.send({ status: true,data:getresult.rows});
}
catch(err){
    console.log(err);
}
}

exports.updatemarks = async (req, res) => {
    try{
    const id=req.body.id;
    const name=req.body.name;
    const marks=req.body.marks;
    const query=`update submittedfiles set marks='${marks}' where full_name='${name}'and id='${id}'`;
    let getresult = await queryExecutor(query);
    res.send({ status: true,marks});
    }catch(err){
        console.log(err);
    }
}

exports.updatevalid = async (req, res) => {
    try{
    const id=req.body.id;
    const query=`update files set valid='true' where id='${id}'`;
    let getresult = await queryExecutor(query);
    res.send({status:true});
    }
    catch(err){
        console.log(err);
    }
}