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

exports.studentrequests = async (req, res) => {
    try{
    const query = `select * from student where valid='f'`;
    let getresult = await queryExecutor(query);
    res.send({ status: true, data:getresult.rows })
    }catch(err){
        console.log(err);
    }
}

exports.teacherrequests = async (req, res) => {
    try{
    const query = `select id,full_name,username,subject,string_agg(classes,',') as classlist from teacher where valid='f' group by (id,full_name,username,subject)`;
    let getresult = await queryExecutor(query);
    res.send({ status: true, data:getresult.rows })
    }catch(err){
        console.log(err);
    }
}

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
            text:"Dear Student Your class of '+subject+' has been scheduled on "+date+" at "+time,
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


exports.fileup = async (req, res) => {
    console.log(req.body)
}