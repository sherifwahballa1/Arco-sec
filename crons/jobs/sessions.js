const Config = require('../../config');
const Session = require('../../security/session.model');
const timeFactory = require('../../modules/time-factory.js');
const Logger = require('../../modules/logger.js');

module.exports = function (CronJob) {


  const job = new CronJob({
    // delete every hour blocked sessions
    cronTime: '0 */59 * * * *',
    onTick () {
      Logger.trace('highlight', 'SESSION/ CRONJOB', `cronjob 🕒 ${new Date()}`);
      Logger.trace('info', 'session/cronjob', `removeling less than ${timeFactory.cal('remove', 5, 'minutes', new Date())}`);

      Session.find({ $or: [{ 'usage.blocked': true }, { 'usage.total': { $gte : 1500 } }] }).remove().exec();
    },
    start: false,
    timeZone: Config.timeZone
  });
  job.start();

};