var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var loginRouter = require('./routes/login');
var registRouter = require('./routes/regist');
var userRouter=require('./routes/user')
var qiniuRouter=require('./routes/qiniuToken')
var bookRouter=require('./routes/books')
var borrowAndReturnRouter=require('./routes/borrowAndReturn')
var authorityRouter=require('./routes/authority')

var app = express();

var jwt=require('jsonwebtoken')
var {expressjwt}=require('express-jwt')
var scretkey="book_management_system"
app.use(expressjwt({secret:scretkey,algorithms:['HS256']}).unless({path:[/^\/api\//]}))
const cors=require('cors')
app.use(cors())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('', loginRouter );
app.use('', registRouter);
app.use('',userRouter)
app.use('',qiniuRouter)
app.use('',bookRouter)
app.use('',borrowAndReturnRouter)
app.use('',authorityRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(req, res, next) {
  next(createError(401));
});

app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send("未授权或权限过期！")
  }
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
