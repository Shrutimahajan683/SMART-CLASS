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
const featureRouter=require('./router/feature')
const discussionRouter=require('./router/discussion')
app.use('/signup',signupRouter)
app.use('/signin',signinRouter)
app.use('/otp',otpRouter)
app.use('/discussion',discussionRouter)
const path =require('path')

const storage = multer.diskStorage({
    destination: './uploads',
    filename: function (req, file, cb) {
    //   const mimeExtension={
    //       'image/pdf':'.pdf'
    // mimeExtension[file.mimetype]
    //   }
      cb(null, file.fieldname + '-' + Date.now()+path.extname(file.originalname))
    }
  })


//   fileFilter:(req,file,cb)=>{
//     if(file.mimetype==='image/pdf'){
//         cb(null,true)
//     }else{
//         cb(null,false)
//     }
// }
  const upload = multer({ storage: storage,
 });

app.use('/anotherfeature',featureRouter)
app.post("/feature/uploadassignment", upload.single("files"), (req,res)=>{
    console.log(req.file);
    return res.json({ status: true ,data:req.file})
});

// function uploadFiles(req, res) {
//         res.json({ data:req.file });
// }
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