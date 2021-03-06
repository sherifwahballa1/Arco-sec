const express = require('express');
const Security = require('./../../security');

const router = express.Router();

const {
  signup,
  sendVerification,
  verify,
  login,
  updatePassword,
  forgotPassword,
  resetPassword,
  viewProfile,
  changeName,
  getEmails,
  createMail,
  getInboxMessages,
  getSentMessages,
  getMailById
} = require('./userControllers');


router.post("/signup", signup);
router.post("/login", login);

router.post('/requestVerificationCode', Security.validateTempToken, sendVerification);
router.post("/verify", Security.validateTempToken, verify);

// -----------------------
router.post("/profile", Security.auth(['user']), viewProfile);
router.post("/update-name", Security.auth(['user']), changeName);
router.post("/emails", Security.auth(['admin', 'user']), getEmails);
// -----------------------
router.post('/user-profile/:id', Security.auth(['user']), viewProfile);
// -----------------------

router.post("/updatePassword", Security.auth(['user']), updatePassword);
router.post("/forgetPassword", forgotPassword);
router.post("/resetPassword", Security.validateTempToken, resetPassword);
// -----------------------
router.post("/createMail", Security.auth(['user']), createMail);

router.get("/inbox-mails", Security.auth(['user']), getInboxMessages);
router.get("/sent-mails", Security.auth(['user']), getSentMessages);
router.get("/mail/:mailId", Security.auth(['user']), getMailById);

module.exports = router;