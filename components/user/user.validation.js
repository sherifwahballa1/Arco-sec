const joi = require('@hapi/joi');

const signupSchema = {
  name: joi.string()
    .required()
    .trim()
    .lowercase()
    .ruleset
    .pattern(/^[a-zA-Z-0-9]+$/)
    .min(2)
    .max(20)
    .rule({ message: 'Username length must be between 4~20 characters and consists of letters only' }),

  password: joi.string()
    .required()
    .trim()
    .pattern(/(?=^.{8,}$)((?=.*\d)(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
    .message('Password must be at least a minimum of 8 characters long with 1 small letter, 1 capital letter, 1 number and 1 special character'),

  email: joi.string()
    .required()
    .email()
    .lowercase()
    .message('Invalid email')
};

const loginSchema = {
  email: joi.string()
  .required()
  .email()
  .lowercase()
  .message('Invalid email'),

  password: joi.string()
    .required()
    .trim()
    .pattern(/(?=^.{8,}$)((?=.*\d)(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
};

const updatePasswordSchema = {
  oldPassword: signupSchema.password,
  newPassword: signupSchema.password
};

const paginationSchema = {
  pageNo: joi.string()
    .trim()
    .pattern(/^[0-9]*$/) // find a way to limit the number according to number of documents
    .message('Enter a valid number'),
  limitNo: joi.string()
    .trim()
    .pattern(/^[0-9]*$/) // find a way to limit the number according to number of documents
    .message('Enter a valid number')
};

const getLeaderBoard = {
  pageNo: paginationSchema.pageNo,
  limitNo: paginationSchema.limitNo
};

const otpSchema = {
  otp: joi.string()
    .required()
    .trim()
    .ruleset
    .length(6)
    .pattern(/[0-9]{6}/)
    .rule({ message: 'invalid code' })
};

const mailSchema = {
  sender: joi.string().required(),
  subject: joi.string().required(),
  tags: joi.array()
}

module.exports = {
  signup: joi.object(signupSchema),
  login: joi.object(loginSchema),
  updatePassword: joi.object(updatePasswordSchema),
  leaderBoard: joi.object(getLeaderBoard),
  otpSchema: joi.object(otpSchema),
  // todo addMail: joi.object(mailSchema),
  forgotPassword: joi.object({ email: loginSchema.email }),
  resetPassword: joi.object({ password: signupSchema.password }),
  userNameSchema: joi.object({ name: signupSchema.name})
}