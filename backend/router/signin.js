const otpcontroller = require("../controllers/signin")
const router = require("express").Router();
router.post('/teacher', otpcontroller.teacher)
router.post('/student', otpcontroller.student)
router.post('/file', otpcontroller.fileup)
router.post('/admin', otpcontroller.admin)
router.get('/studentrequests', otpcontroller.studentrequests)
router.get('/teacherrequests', otpcontroller.teacherrequests)
router.post('/studentaccept', otpcontroller.studentaccept)
router.post('/studentdecline', otpcontroller.studentdecline)
router.post('/teacheraccept', otpcontroller.teacheraccept)
router.post('/teacherdecline', otpcontroller.teacherdecline)
module.exports = router