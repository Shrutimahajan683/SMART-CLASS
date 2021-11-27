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
const crypto = require('crypto');
const nodemailer=require('nodemailer')
const sgMail = require('@sendgrid/mail');
const smsKey = process.env.SMS_SECRET_KEY;
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

//sending otp to the user who entered username
exports.send = async (req, res) => {
    try{
const username=req.body.username;
console.log(username)
const otp = Math.floor(100000 + Math.random() * 900000);
const ttl = 2 * 60 * 1000;
const expires = Date.now() + ttl;
const data = `${username}.${otp}.${expires}`;
const hash = crypto.createHmac('sha256', smsKey).update(data).digest('hex');
const fullHash = `${hash}.${expires}`;
// sgMail.setApiKey('');
// const msg = {
//         to: username,
//         from: 'shrutimahajan3611@gmail.com',
//         subject: 'OTP',
//         text: 'service available',
//         html: 'Your One Time Login Password For CFM is ' +otp,
// };
// sgMail.send(msg).then(() => {
// console.log('sent');
// }).catch((error) => {
// console.log('error', error);
// });
let mailoptions={
    from:process.env.GMAILID,
    to:username,
    subject:"OTP",
    text:"Your One Time Login Password is"+otp
}

transporter.sendMail(mailoptions,function(err,success){
    if(err)
    console.log(err);
    else
    console.log("mail send");
})

res.status(200).send({  status:true,hash: fullHash, otp ,mssg:process.env.USERNAME});
    }catch(err){
        console.log(err);
    }
}


//verifying otp 
exports.verify = async (req, res) => {
    try{
    const hash = req.body.hash;
    const otp = req.body.otp;
    const username=req.body.username
    let [ hashValue, expires ] = hash.split('.');
    
    let now = Date.now();
    if (now > parseInt(expires)) {
         return res.status(504).send({ status:false,message: 'Timeout. Please try again' });
    }
    let data = `${username}.${otp}.${expires}`;
    let newCalculatedHash = crypto.createHmac('sha256', smsKey).update(data).digest('hex');
    if (newCalculatedHash === hashValue) {
        return res.status(504).send({ status:true });
    }
    else
    {
        return res.status(504).send({ status:false,message:"Wrong otp" });
    }
}catch(err){
    console.log(err);
}
}

//setting the account in verfied mode in database
exports.verifygmail = async (req, res) => {
    try{
    console.log(req.body.username)
    const query = `update student set gmail_valid='true' where username='${req.body.username}'`;
    let getresult = await queryExecutor(query);
    const query1 = `update teacher set gmail_valid='true' where username='${req.body.username}'`;
    let getresult1 = await queryExecutor(query1);
    res.send({ status: true})
    }catch(err){
        console.log(err);
    }
}

//verfying username
exports.otpverify = async (req, res) => {
    try{
    const username=req.body.username;
    const query = `select * from student where username='${req.body.username}'`;
    let getresult = await queryExecutor(query);
    const query1 = `select * from teacher where username='${req.body.username}'`;
    let getresult1 = await queryExecutor(query1);
    if(getresult.rows.length>0)
    res.send({status:true})
    else if(getresult1.rows.length>0)
    res.send({status:true})
    else
    res.send({status:false})
    }catch(err){
        console.log(err);
    }
}