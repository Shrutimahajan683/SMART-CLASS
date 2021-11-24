const otpcontroller=require("../controllers/signup")
const router = require("express").Router();
router.post('/teacher',otpcontroller.teacher)
router.post('/student',otpcontroller.student)
module.exports=router