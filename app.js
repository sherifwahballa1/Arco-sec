/* eslint-disable object-shorthand */
const express = require('express');
const fs = require('fs');
// eslint-disable-next-line new-cap
const path = require('path');
const jwt = require('jsonwebtoken');
const cors = require('cors');
// const winston = require('winston');
// const expressWinston = require('express-winston');
require('winston-daily-rotate-file');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize'); // for nosql injection
const xxs = require('xss-clean'); // for injection
const dotenv = require('dotenv').config({ path: './config.env'}); //for config files
const rateLimit = require('express-rate-limit'); // to prevent many of requests from the same ip and prevent fro
const MongoStore = require('rate-limit-mongo');

const Config = require('./config');
const pjson = require('./package.json');
const Logger = require('./modules/logger.js');
const appCrons = require('./crons');
const Security = require('./security');

const { UserAPI } = require('./components/user');


// require('./modules/redis');

// const downloadFile =  require('./components/challenge/challengeControllers/challenge.download');

const app = express();
const PORT = process.env.PORT || 5100;


// database connection
mongoose.connect(Config.dbURI, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false }, () => {
  console.log('Database Connected Successfully');
});

const resolveCrossDomain = function(req, res,next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", "Content-Type, authorization");
  res.header("Access-Control-Allow-Credentials", true);

  if ('OPTIONS' == req.method) {
      res.send(200);
  }
  else {
      next();
  }
}; 
app.use(resolveCrossDomain);

app.use(cors());

app.use(helmet({
  // over-ridden by masking
  hidePoweredBy: false
}));


// body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// logs db connection errors
Logger.dbConnection(mongoose);
// log the time taken in each request
app.use(Logger.routeTime());
app.use(morgan('tiny'));

const limiter = rateLimit({
  max: 1200,
  windowMs: 60 * 60 * 1000 , // try after one hour
  message: 'Too many requests from this IP, please try again after an hour',
  statusCode: 429, // 429 status = Too Many Requests (RFC 6585)
  headers: true, //Send custom rate limit header with limit and remaining
        // allows to create custom keys (by default user IP is used)
  keyGenerator: function (req , res) {
    if (req.headers.authorization) {
      let userData = jwt.decode(req.headers.authorization);
      return userData._id;
    }
  },
  skip: function (/*req, res*/) {
        return false;
    },
  handler: function (req, res, /*next*/) {
    res.status(429).json({message: "Too Many requests from this team...Team Blocked...try again after one hour"});
  },
  store: new MongoStore({
    uri: Config.dbURI,
    collectionName: 'block',
    expireTimeMs: 60 * 60 * 1000
  })
});

app.use('/api', limiter);
// limit on any url start with /api


// Data sanitization against NoSQL Query injection
app.use(mongoSanitize()); // prevent from NoSQL injection like (email:{"$gt":""}) in body

// Data sanitization against cross-site scripting (XSS)
app.use(xxs()); // prevent if code contain html code or js code in body and convert it to symbols known

// app.use(morgan('combined', { stream: winston.stream }));
app.use(Security.preventBlocked);

Security.masking(app);

// set port
app.set('port', PORT);

// app.use(express.static(`${__dirname }/clients/wargame_front`));


app.use('/api/user', UserAPI);

// app.get('/download/:name', downloadFile);


// activate all cron jobs
appCrons();


// app.get('/', (req, res) => {
//   res.sendFile(path.resolve('./clients/wargame_front/index.html'));
// });


// redirect client
// app.get('*', (req, res) => {
//   res.sendFile(path.resolve('./clients/wargame_front/index.html'));
// });


if (Config.canUseCustomErrorPages) {
  // Handle 500
  app.use(function (error, req, res, next) {
    res.status(500).send({ title: '500: Internal Server Error', error });
    // // set locals, only providing error in development
    // res.locals.message = error.message;
    // res.locals.error = req.app.get('env') === 'development' ? error : {};

    // // add this line to include winston logging
    // // winston.error(`${error.status || 500} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    // winston.error(winston.combinedFormat(error, req, res));

    // // render the error page
    // res.status(error.status || 500);
    // res.render('error');
  });

  // Handle 404
  app.use(function (req, res) {
    res.status(404).send({ title: '404: File Not Found' });
    Security.log404(req);
  });
}


const server = require('http').createServer(app);
server.listen(app.get('port'), function () {
  console.log(` ################## ${pjson.name} \n ##################  ${Config.currentEnv}  \n ################## running on port : ${app.get('port')}`);
});