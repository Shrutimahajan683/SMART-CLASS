const otpcontroller = require("../controllers/classrequest")
const router = require("express").Router();
router.post('/sendrequest', otpcontroller.sendrequest)
router.post('/acceptclassdata', otpcontroller.acceptclassdata)
router.post('/declineclassdata', otpcontroller.declineclassdata)
router.post('/classdata', otpcontroller.classdata)
router.post('/request', otpcontroller.request)

module.exports = router