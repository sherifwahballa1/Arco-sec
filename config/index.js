const defaultSecret = 'YYzviNIcWQQbhthH0DqlvCTFuJHEmJfa';
const defaultTempTokenSecret = '40VUEA8T29nAF8Q9d4FcbgsUfxVreZFz';

const envs = {
  production: 'production',
  development: 'development',
  staging: 'staging',
  test: 'test'
};

const currentEnv = process.env.NODE_ENV || envs.production;
const config = require(`./env/${currentEnv}.json`);


config.JWTsecret = process.env.SECRET || defaultSecret;
config.tempTokenSecret = process.env.TEMP_TOKEN_SECRET || defaultTempTokenSecret;
config.envs = envs;
config.currentEnv = currentEnv;

config.isEmailVerificationRequired = true;
config.canSendEmail = true;
config.canUseCustomErrorPages = true;
config.canHttps = true;

// prevent public routes abuse and scanning
config.preventAbuse = true;
config.canTest = false;

// ENVIRONMENT specific
if (config.currentEnv === config.envs.development) {
  config.isEmailVerificationRequired = false;
  config.canSendEmail = false;
  config.canUseCustomErrorPages = false;
  config.canHttps = false;
  config.preventAbuse = false;
  config.canTest = true;
}
if (config.currentEnv === config.envs.test) {
  config.isEmailVerificationRequired = false;
  config.canSendEmail = true;
  config.canUseCustomErrorPages = false;
  config.canHttps = false;
  config.preventAbuse = false;
  config.canTest = true;
}



console.log(`===================== CONFIG [${currentEnv}] =====================`);

config.JWTsecret = process.env.SECRET || defaultSecret;
config.tempTokenSecret = process.env.TEMP_TOKEN_SECRET || defaultTempTokenSecret;

config.email = {
  user: 'arcosec20@gmail.com',
  pass: '@isec2020'
}

module.exports = config;