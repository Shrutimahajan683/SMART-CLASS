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

//storing student class request in database
exports.sendrequest = async (req, res) => {
    try{
      const {
          time,
          token,
          subject,
          sdate
      } = req.body
      let mem = jwt.verify(token, process.env.PRIVATEKEY);
          const student_id=mem.id
      let id = 'mem-' + uuidv4()
      const query = `select sclass,username from student where id='${student_id}'`;
      let getresult = await queryExecutor(query);
      const sclass=getresult.rows[0].sclass;
      const username=getresult.rows[0].username;
      const date=sdate
      const query1 = insertQuery('classrequest', {
          id,
          student_id,
          sclass,
          subject,
          username,
          time,
          date,
          created_at: "current_timestamp",
          updated_at: "current_timestamp",
        })
        let result = await queryExecutor(query1)
        
        if(result.severity=='ERROR'){
          return res.json({ Status: false,mssg:"Request has already been submitted for the same time and same class" })
        }
        else
        return res.json({ Status: true })
    }
    catch(err){
        return res.json({ Status: false })
    }
}

//removing student request from database and sending mails to teacher and student for class with details after teacher accpeted the request
exports.acceptclassdata = async (req, res) => {
    try{
      const {
          token,
          sclass,
          time,
          date,
          capacity
      } = req.body
      let mem = jwt.verify(token, process.env.PRIVATEKEY);
      const tid=mem.id
        const query = `select subject,full_name,username from teacher where id='${tid}'`;
        let getresult = await queryExecutor(query);
        console.log(getresult)
        const subject=getresult.rows[0].subject;
        const name=getresult.rows[0].full_name;
        const username=getresult.rows[0].username;
        const query1 = `select username from classrequest where subject='${subject}' and time='${time}' and sclass='${sclass}' and date='${date}'`;
        let getresult1 = await queryExecutor(query1);
        let students='';
        let length=getresult1.rowCount;
        if(getresult1.rowCount>capacity)
        length=capacity
        for (let i = 0; i < length; i++) {
            students=students+' '+getresult1.rows[i].username;
        //     sgMail.setApiKey('');
        // const msg = {
        //         to: getresult1.rows[i].username,
        //         from: 'shrutimahajan3611@gmail.com',
        //         subject: 'Class Scheduled',
        //         text: 'service available',
        //         html: 'Dear Student Your class of '+subject+' has been scheduled on '+date+' at '+time,
        // };
        // sgMail.send(msg).then(() => {
        // console.log('sent');
        // }).catch((error) => {
        // console.log('error', error);
        // });
        let mailoptions={
            from:process.env.GMAILID,
            to:getresult1.rows[i].username,
            subject:"Class Scheduled",
            text:"Dear Student Your class of "+subject+"has been scheduled on "+date+" at "+time,
        }
        
        transporter.sendMail(mailoptions,function(err,success){
            if(err)
            console.log(err);
            else
            console.log("mail send");
        })

        }
        // sgMail.setApiKey('');
        // const msg = {
        //         to: username,
        //         from: 'shrutimahajan3611@gmail.com',
        //         subject: 'Class Scheduled',
        //         text: 'service available',
        //         html: 'Dear '+name+' Your class has been scheduled on '+date+' for class '+sclass+' at '+time+' .The emails of the students  who requested for this class are '+students,
        // };
        // sgMail.send(msg).then(() => {
        // console.log('sent');
        // }).catch((error) => {
        // console.log('error', error);
        // });
        let mailoptions={
            from:process.env.GMAILID,
            to:username,
            subject:"Class Scheduled",
            text:"Dear "+name+" Your class has been scheduled on "+date+" for class "+sclass+" at "+time+" .The emails of the students  who requested for this class are "+students
        }
        
        transporter.sendMail(mailoptions,function(err,success){
            if(err)
            console.log(err);
            else
            console.log("mail send");
        })
        const query2 = `delete from classrequest where subject='${subject}' and time='${time}' and sclass='${sclass}' and date='${date}' `;
        let getresult2 = await queryExecutor(query2);
      res.send({Status:true});
    }
      catch(err){
         console.log(err);
      }
}

//removing class request from database
exports.declineclassdata = async (req, res) => {
    try{
      const {
          token,
          sclass,
          time,
          date
      } = req.body
      let mem = jwt.verify(token, process.env.PRIVATEKEY);
      const tid=mem.id
      const query = `select subject from teacher where id='${tid}'`;
      let getresult = await queryExecutor(query);
      const subject=getresult.rows[0].subject;
      const query1 = `delete from classrequest where subject='${subject}' and time='${time}' and sclass='${sclass}' and date='${date}' `;
      let getresult1 = await queryExecutor(query1);
      res.send({Status:true});
    }
      catch(err){
         console.log(err);
      }
}

//fetching class requests from database
exports.classdata = async (req, res) => {
    console.log("hey")
    try{
      const {
          token,
          sclass
      } = req.body
      let mem = jwt.verify(token, process.env.PRIVATEKEY);
      const id=mem.id
      let get = `select subject from teacher where id='${id}' `;
      let getResult = await queryExecutor(get);
      const subject=getResult.rows[0].subject;
      let query=`SELECT time,to_char(date,'YYYY-MM-DD'),count(*) as count from classrequest where sclass='${sclass}' and subject='${subject}' GROUP BY time,date `;
      let result = await queryExecutor(query)
      return res.json({ Status: true,data:result.rows })
    }
      catch(err){
         console.log(err);
      }
    
}

//storing class request in database
exports.request = async (req, res) => {
    try{
      const {
          time,
          token,
          subject,
          sdate
      } = req.body
      let mem = jwt.verify(token, process.env.PRIVATEKEY);
          const student_id=mem.id
      let id = 'mem-' + uuidv4()
      const query = `select sclass,username from student where id='${student_id}'`;
      let getresult = await queryExecutor(query);
      const sclass=getresult.rows[0].sclass;
      const username=getresult.rows[0].username;
      const date=sdate
      const query1 = insertQuery('classrequest', {
          id,
          student_id,
          sclass,
          subject,
          username,
          time,
          date,
          created_at: "current_timestamp",
          updated_at: "current_timestamp",
        })
        console.log(date);
        let result = await queryExecutor(query1)
        console.log(result)
        if(result.severity=='ERROR'){
          return res.json({ Status: false,mssg:"Request has already been submitted for the same time and same class" })
        }
        else
        return res.json({ Status: true })
    }
    catch(err){
        return res.json({ Status: false })
    }
}
