const otpcontroller = require("../controllers/discussion")
const router = require("express").Router();
router.post('/submittopic', otpcontroller.submittopic)
router.post('/fetchtopics', otpcontroller.fetchtopics)
router.post('/fetchposts', otpcontroller.fetchposts)
router.post('/submitposts', otpcontroller.submitposts)

module.exports = router