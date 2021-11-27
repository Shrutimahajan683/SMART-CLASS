const otpcontroller = require("../controllers/quiz")
const router = require("express").Router();
router.post('/getquiz', otpcontroller.getquiz)
router.post('/createquiz', otpcontroller.createquiz)
router.post('/takequiz', otpcontroller.takequiz)
router.post('/viewquiz', otpcontroller.viewquiz)
router.post('/quizresult', otpcontroller.quizresult)

module.exports = router