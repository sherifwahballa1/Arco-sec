const { CronJob } = require('cron');
const session = require('./jobs/sessions.js');

module.exports = function () {
  session(CronJob);
};