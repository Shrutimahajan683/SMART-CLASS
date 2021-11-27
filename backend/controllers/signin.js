const express = require('express');
const app = express();
app.use(express.json());
const sgMail = require('@sendgrid/mail');
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
const { student } = require('./signup');
const nodemailer=require('nodemailer')
let transporter=nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.GMAILID,
        pass:process.env.PASS
    },
    tls:{
        rejectUnauthorized:false,
    },
})

//verifying student details whing signing in
exports.student = async (req, res) => {
    try{
    const {
        username,
        password
    } = req.body
    let first_check = selectQuery('student', { username }, [])
    let first_check_result = await queryExecutor(first_check)
    if (first_check_result.rowCount == 1) {
        if (first_check_result.rows[0].password == password) {
            console.log(typeof(first_check_result.rows[0].valid))
             if(!first_check_result.rows[0].gmail_valid){
                res.send({ status: false, mssg: "Verify your account" })
        }
            else if(!first_check_result.rows[0].valid)
            {
                res.send({ status: false, mssg: "Wait for admin to accept your signup request" })
        }
            else{
                const id = first_check_result.rows[0].id;
                let token = jwt.sign({ id }, process.env.PRIVATEKEY)
                const query = `select sclass from student where id='${id}'`;
                let getResult = await queryExecutor(query);
                const rnumber = getResult.rows[0].sclass;
                const query1 = `select subject from teacher where classes='${rnumber}'`;
                let getResult1 = await queryExecutor(query1);
                let result = ObjecttoArrayConverter(
                    getResult1.rows,
                    "subject"
                );
                console.log(first_check_result)
                res.send({ status: true, mssg: `${token}`, data: `${result}`,role:"student" })
            }
        }
        else {
            res.send({ status: false, mssg: "Wrong password" })
        }
    }
    else {
        res.send({ status: false, mssg: "User doesn't exists" })
    }
}catch(err){
    console.log(err);
}
}

//verifying teacher details while siginingin
exports.teacher = async (req, res) => {
    try{
    const {
        username,
        password
    } = req.body
    let first_check = selectQuery('teacher', { username }, [])
    let first_check_result = await queryExecutor(first_check)
    if (first_check_result.rowCount > 0) {
        if (first_check_result.rows[0].password == password) {
             if(!first_check_result.rows[0].gmail_valid){
                res.send({ status: false, mssg: "Verify your account" })
        }
           else if(!first_check_result.rows[0].valid)
            res.send({ status: false, mssg: "Wait for admin to accept your signup request" })
            else{
                const id = first_check_result.rows[0].id;
                let token = jwt.sign({ id }, process.env.PRIVATEKEY)
                const query = `select classes from teacher where id='${id}'`;
                let getResult = await queryExecutor(query);
                let result = ObjecttoArrayConverter(
                    getResult.rows,
                    "classes"
                );
                res.send({ status: true, mssg: `${token}`, data: `${result}` ,role:"teacher"})
            }
        }
        else {
            res.send({ status: false, mssg: "Wrong password" })
        }
    }
    else {
        res.send({ status: false, mssg: "User doesn't exists" })
    }
}catch(err){
    console.log(err);
}
}

//verifying admin details while signingin
exports.admin = async (req, res) => {
    try{
    console.log("hi")
    const {
        username,
        password
    } = req.body
    let first_check = selectQuery('admin', { username }, [])
    let first_check_result = await queryExecutor(first_check)
    if (first_check_result.rowCount == 1) {
        if (first_check_result.rows[0].password == password) {
            res.send({ status: true })
        }
        else {
            res.send({ status: false, message: "Wrong password" })
        }
    }
    else {
        res.send({ status: false, message: "User doesn't exists" })
    }
}catch(err){
    console.log(err);
}
}

//fetching student requests for admin
exports.studentrequests = async (req, res) => {
    try{
    const query = `select * from student where valid='f'`;
    let getresult = await queryExecutor(query);
    res.send({ status: true, data:getresult.rows })
    }catch(err){
        console.log(err);
    }
}

//fetching teacher requests for admin
exports.teacherrequests = async (req, res) => {
    try{
    const query = `select id,full_name,username,subject,string_agg(classes,',') as classlist from teacher where valid='f' group by (id,full_name,username,subject)`;
    let getresult = await queryExecutor(query);
    res.send({ status: true, data:getresult.rows })
    }catch(err){
        console.log(err);
    }
}

//setting student account in verified mode
exports.studentaccept = async (req, res) => {
    try{
    const query = `update student set valid='true' where username='${req.body.data}'`;
    let getresult = await queryExecutor(query);
    // sgMail.setApiKey('');
    //     const msg = {
    //             to: req.body.data,
    //             from: 'shrutimahajan3611@gmail.com',
    //             subject: 'Access request declined',
    //             text: 'service available',
    //             html: 'Dear student your request for accessing website has been accepted  by admin. Welcome to Smart Class !',
    //     };
    //     sgMail.send(msg).then(() => {
    //     console.log('sent');
    //     }).catch((error) => {
    //     console.log('error', error);
    //     });
    let mailoptions={
        from:process.env.GMAILID,
        to:req.body.data,
        subject:"Access request accepted",
        text:"Dear student your request for accessing website has been accepted  by admin. Welcome to Smart Class !"
    }
    
    transporter.sendMail(mailoptions,function(err,success){
        if(err)
        console.log(err);
        else
        console.log("mail send");
    })
    res.send({ status: true})
}catch(err){
    console.log(err);
}
}

//removing student details from database
exports.studentdecline = async (req, res) => {
    try{
    const query = `delete from student  where username='${req.body.data}'`;
    let getresult = await queryExecutor(query);
    // sgMail.setApiKey('');
    //     const msg = {
    //             to: req.body.data,
    //             from: 'shrutimahajan3611@gmail.com',
    //             subject: 'Access request declined',
    //             text: 'service available',
    //             html: 'Dear student your request for accessing website has been declined by admin',
    //     };
    //     sgMail.send(msg).then(() => {
    //     console.log('sent');
    //     }).catch((error) => {
    //     console.log('error', error);
    //     });
    let mailoptions={
        from:process.env.GMAILID,
        to:req.body.data,
        subject:"Access request declined",
        text:"Dear student your request for accessing website Smart Class has been declined!"
    }
    
    transporter.sendMail(mailoptions,function(err,success){
        if(err)
        console.log(err);
        else
        console.log("mail send");
    })
    res.send({ status: true})
}catch(err){
    console.log(err);
}
}

//setting teacher account in verified mode
exports.teacheraccept = async (req, res) => {
    try{
    console.log("teacher")
    const query = `update teacher set valid='true' where username='${req.body.data}'`;
    console.log(query)
    let getresult = await queryExecutor(query);
    // sgMail.setApiKey('');
    //     const msg = {
    //             to: req.body.data,
    //             from: 'shrutimahajan3611@gmail.com',
    //             subject: 'Access request declined',
    //             text: 'service available',
    //             html: 'Dear teacher your request for accessing website has been accepted  by admin. Welcome to Smart Class !',
    //     };
    //     sgMail.send(msg).then(() => {
    //     console.log('sent');
    //     }).catch((error) => {
    //     console.log('error', error);
    //     });
    let mailoptions={
        from:process.env.GMAILID,
        to:req.body.data,
        subject:"Access request accepted",
        text:"Dear teacher your request for accessing website has been accepted  by admin. Welcome to Smart Class !"
    }
    
    transporter.sendMail(mailoptions,function(err,success){
        if(err)
        console.log(err);
        else
        console.log("mail send");
    })
    res.send({ status: true})
}catch(err){
    console.log(err);
}
}

//removing teacher details from database
exports.teacherdecline = async (req, res) => {
    try{
    const query = `delete from teacher where username='${req.body.data}'`;
    let getresult = await queryExecutor(query);
    // sgMail.setApiKey('');
    //     const msg = {
    //             to: req.body.data,
    //             from: 'shrutimahajan3611@gmail.com',
    //             subject: 'Access request declined',
    //             text: 'service available',
    //             html: 'Dear teacher your request for accessing website has been declined by admin',
    //     };
    //     sgMail.send(msg).then(() => {
    //     console.log('sent');
    //     }).catch((error) => {
    //     console.log('error', error);
    //     });
    let mailoptions={
        from:process.env.GMAILID,
        to:req.body.data,
        subject:"Access request declined",
        text:"Dear student your request for accessing website Smart Class has been declined!"
    }
    
    transporter.sendMail(mailoptions,function(err,success){
        if(err)
        console.log(err);
        else
        console.log("mail send");
    })
    res.send({ status: true})
}catch(err){
    console.log(err);
}
}




exports.fileup = async (req, res) => {
    console.log(req.body)
}