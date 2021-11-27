const otpcontroller = require("../controllers/assignment")
const router = require("express").Router();
router.post('/assignment', otpcontroller.assignment)
router.post('/studentassignment', otpcontroller.studentassignment)
router.post('/submitassignment', otpcontroller.submitassignment)
router.post('/submission', otpcontroller.submission)
router.post('/fetchassignments', otpcontroller.fetchassignments)
router.post('/fetchsubmissions', otpcontroller.fetchsubmissions)
router.post('/updatemarks', otpcontroller.updatemarks)
router.post('/updatevalid', otpcontroller.updatevalid)
router.post('/studentsubmittedassignment', otpcontroller.studentsubmittedassignment)

module.exports = router