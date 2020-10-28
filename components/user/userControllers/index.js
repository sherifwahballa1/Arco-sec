/* eslint-disable no-multi-spaces */
const signup = require('./user.signup'); 
const sendVerification = require('./user.sendVerification'); 
const verify = require('./user.verify'); 
const login = require('./user.login');
const updatePassword = require('./user.updatePassword');
const resetPassword = require('./user.resetPassword');
const forgotPassword = require('./user.forgotPassword');
const viewProfile = require('./user.viewProfile');
const changeName = require('./user.changeName');

module.exports = {
  signup,
  sendVerification,
  verify,
  login,
  updatePassword,
  resetPassword,
  forgotPassword,
  viewProfile,
  changeName
};