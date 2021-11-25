const otpcontroller = require("../controllers/signin")
const router = require("express").Router();
router.post('/teacher', otpcontroller.teacher)
router.post('/student', otpcontroller.student)
router.post('/request', otpcontroller.request)
router.post('/classdata', otpcontroller.classdata)
router.post('/acceptclassdata', otpcontroller.acceptclassdata)
router.post('/declineclassdata', otpcontroller.declineclassdata)
router.post('/file', otpcontroller.fileup)
router.post('/createquiz', otpcontroller.createquiz)
router.post('/getquiz', otpcontroller.getquiz)
router.post('/takequiz', otpcontroller.takequiz)
router.post('/quizresult', otpcontroller.quizresult)
router.post('/viewquiz', otpcontroller.viewquiz)
router.post('/admin', otpcontroller.admin)
router.get('/studentrequests', otpcontroller.studentrequests)
router.get('/teacherrequests', otpcontroller.teacherrequests)
router.post('/studentaccept', otpcontroller.studentaccept)
router.post('/studentdecline', otpcontroller.studentdecline)
router.post('/teacheraccept', otpcontroller.teacheraccept)
router.post('/teacherdecline', otpcontroller.teacherdecline)
module.exports = router