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


//fetching quiz data
exports.getquiz = async (req, res) => {
    try{
        const {
            token,
            subject
        } = req.body
        let mem = jwt.verify(token, process.env.PRIVATEKEY);
        const tid=mem.id
        const query = `select sclass from student where id='${tid}'`;
        let getresult = await queryExecutor(query);
        const sclass=getresult.rows[0].sclass;
        const query1 = `select quizname from quizes where subject='${subject}' and sclass='${sclass}'`;
        let getresult1 = await queryExecutor(query1);
        let result = ObjecttoArrayConverter(
            getresult1.rows,
            "quizname"
        );
        return res.json({ Status: true,data:result })
    }
    catch(err){
        console.log(err);
     }
}

//storing quiz details in database
exports.createquiz = async (req, res) => {
    try{
        const {
            token,
            obj,
            count,
            quizname,
            sclass
        } = req.body
        let mem = jwt.verify(token, process.env.PRIVATEKEY);
        const tid=mem.id
        const query = `select subject from teacher where id='${tid}'`;
        let getresult = await queryExecutor(query);
        const subject=getresult.rows[0].subject;
        let id = 'mem-' + uuidv4()
        const quiz=JSON.stringify(obj)
        const query1 = insertQuery('quizes', {
            id,
            sclass,
            subject,
            quiz,
            count,
            quizname,
            created_at: "current_timestamp",
            updated_at: "current_timestamp",
          })
          let result = await queryExecutor(query1)
          console.log(result)
          return res.json({ Status: true })
        }
        catch(err){
            console.log(err);
         }
}

//fetching quiz details from database
exports.takequiz = async (req, res) => {
    try{
        const {
            token,
            subject,
            quizname
        } = req.body
        let mem = jwt.verify(token, process.env.PRIVATEKEY);
        const tid=mem.id
        const query = `select sclass from student where id='${tid}'`;
        let getresult = await queryExecutor(query);
        const sclass=getresult.rows[0].sclass;
        const query1 = `select quiz,count from quizes where subject='${subject}' and sclass='${sclass}' and quizname='${quizname}'`;
        let getresult1 = await queryExecutor(query1);
        return res.json({ Status: true,data:getresult1.rows[0] })
    }
    catch(err){
        console.log(err);
     }
}

//calculating quiz result by checking correct answers stored in database
exports.quizresult = async (req, res) => {
    console.log("quiz")
    try{
        const {
            token,
            subject,
            quizname,
            result
        } = req.body
        let mem = jwt.verify(token, process.env.PRIVATEKEY);
        const tid=mem.id
        const query = `select sclass from student where id='${tid}'`;
        let getresult = await queryExecutor(query);
        const sclass=getresult.rows[0].sclass;
        const query1 = `select quiz,count from quizes where subject='${subject}' and sclass='${sclass}' and quizname='${quizname}'`;
        let getresult1 = await queryExecutor(query1);
       const count=getresult1.rows[0].count;
       const obj=getresult1.rows[0].quiz;
       let correct=0;
       for(c=1;c<=count;c++){
           if(obj[c].r==result[c])
           correct=correct+1;
       }
       return res.json({ Status: true,result:correct })
    }
    catch(err){
        console.log(err);
     }
}

//getting quiz details
exports.viewquiz = async (req, res) => {
    try{
        const {
            token,
            subject,
            quizname
        } = req.body
        let mem = jwt.verify(token, process.env.PRIVATEKEY);
        const tid=mem.id
        const query = `select sclass from student where id='${tid}'`;
        let getresult = await queryExecutor(query);
        const sclass=getresult.rows[0].sclass;
        const query1 = `select quiz,count from quizes where subject='${subject}' and sclass='${sclass}' and quizname='${quizname}'`;
        let getresult1 = await queryExecutor(query1);
        return res.json({ Status: true,data:getresult1.rows[0] });
    }
    catch(err){
        console.log(err);
     }
}
