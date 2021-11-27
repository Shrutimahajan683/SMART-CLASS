const express=require('express')
const app=express()
const multer = require("multer");
// const upload = multer({ dest: "uploads/" });
const PORT=3000
const cors = require('cors')
app.use(cors())
const pool = require("./Database/dbconn");
const cookieParser = require('cookie-parser');
app.use(cookieParser());
require('dotenv').config();
app.use(express.json())

const signupRouter=require('./router/signup')
const signinRouter=require('./router/signin')
const otpRouter=require('./router/otp')
const featureRouter=require('./router/assignment')
const discussionRouter=require('./router/discussion')
const classrequest=require('./router/classrequest')
const quiz=require('./router/quiz')
app.use('/signup',signupRouter)
app.use('/signin',signinRouter)
app.use('/otp',otpRouter)
app.use('/discussion',discussionRouter)
app.use('/classrequest',classrequest)
app.use('/quiz',quiz)
const path =require('path')

const storage = multer.diskStorage({
    destination: './uploads',
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now()+path.extname(file.originalname))
    }
  })


  const upload = multer({ storage: storage,
 });

app.use('/anotherfeature',featureRouter)
app.post("/feature/uploadassignment", upload.single("files"), (req,res)=>{
    console.log(req.file);
    return res.json({ status: true ,data:req.file})
});


app.get('/image/:filename', (req, res) => {
    const { filename } = req.params;
    const dirname = path.resolve();
    const fullfilepath = path.join(dirname, 'uploads/' + filename);
    return res.sendFile(fullfilepath);
});

app.listen(PORT,()=>{
    console.log("server running at ",PORT)
})
exports.pool=pool