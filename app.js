var createError = require('http-errors');
var express = require('express');
var path = require('path');
var fs = require('fs');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Router
// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
const listRouter = require('./routes/list');
const userRouter = require('./routes/user');

const { verifyJwt } = require('./utils/jwt');

// 清理日常任务，
const { clearDailyTodos } = require('./controller/todolist');
const schedule = require('node-schedule');
const job = schedule.scheduleJob('0 0 1 * * *', function () {
  clearDailyTodos();
});

const cors = require('cors');

// 本次 http 请求实例
var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(
  cors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT']
  })
);
// app.use(cors())

logger.token('userUid', function (req, res) {
  if (req.headers.authorization) {
    const userUid = verifyJwt(req.headers.authorization);
    return userUid.uid;
  } else {
    return 'null';
  }
});
const loggerSetting =
  ':remote-addr - :remote-user :userUid [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer"';
const ENV = process.env.NODE_ENV;
if (ENV !== 'production') {
  // 开发与测试环境
  app.use(
    logger('dev', {
      stream: process.stdout // 默认 process.stdout
    })
  );
} else {
  // 线上环境
  const logFileName = path.join(__dirname, 'logs', 'access.log');
  const writeStream = fs.createWriteStream(logFileName, {
    flags: 'a'
  });
  app.use(
    logger(loggerSetting, {
      stream: writeStream // 默认 process.stdout
    })
  );
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// 静态文件
// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/api/list', listRouter);
app.use('/api/user', userRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  // res.render('error');
  res.send('error');
});

module.exports = app;
