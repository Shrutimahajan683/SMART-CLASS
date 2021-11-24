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
const sgMail = require('@sendgrid/mail');
const smsKey = process.env.SMS_SECRET_KEY;

exports.send = async (req, res) => {
console.log(req.body)
const username=req.body.username;
console.log(username)
const otp = Math.floor(100000 + Math.random() * 900000);
const ttl = 2 * 60 * 1000;
const expires = Date.now() + ttl;
const data = `${otp}.${expires}`;
const hash = crypto.createHmac('sha256', smsKey).update(data).digest('hex');
const fullHash = `${hash}.${expires}`;
sgMail.setApiKey('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');
const msg = {
        to: username,
        from: 'shrutimahajan979@gmail.com',
        subject: 'OTP',
        text: 'service available',
        html: 'Your One Time Login Password For CFM is ' +otp,
};
sgMail.send(msg).then(() => {
console.log('sent');
}).catch((error) => {
console.log('error', error);
});
res.status(200).send({  status:true,hash: fullHash, otp });
}

exports.verify = async (req, res) => {
    const hash = req.body.hash;
    const otp = req.body.otp;
    let [ hashValue, expires ] = hash.split('.');
    
    let now = Date.now();
    if (now > parseInt(expires)) {
         return res.status(504).send({ status:false,message: 'Timeout. Please try again' });
    }
    let data = `${otp}.${expires}`;
    let newCalculatedHash = crypto.createHmac('sha256', smsKey).update(data).digest('hex');
    if (newCalculatedHash === hashValue) {
        return res.status(504).send({ status:true });
    }
    else
    {
        return res.status(504).send({ status:false,message:"Wrong otp" });
    }
}

exports.verifygmail = async (req, res) => {
    console.log(req.body.username)
    const query = `update student set gmail_valid='true' where username='${req.body.username}'`;
    let getresult = await queryExecutor(query);
    const query1 = `update teacher set gmail_valid='true' where username='${req.body.username}'`;
    let getresult1 = await queryExecutor(query1);
    res.send({ status: true})
}