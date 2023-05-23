const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const fs = require('fs');
require('dotenv').config();
const errorController = require('./controllers/errorController');

const mongoose = require('mongoose');

mongoose
  .connect(process.env.MONGOOSE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => {
    console.log('mongodb connected successfully');
  })
  .catch((err) => console.error(err));

const app = express();

app.use(cors('*'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'static')));

// log all requests to access.log
app.use(
  logger('common', {
    stream: fs.createWriteStream(path.join(__dirname, 'access.log'), {
      flags: 'a',
    }),
  })
);

const indexRouter = require('./routes/index');
const authenticationRouter = require('./routes/authentication');
const restaurantsRouter = require('./routes/restaurants');
const foodsRouter = require('./routes/foods');
const cartRouter = require('./routes/cart');
const bookmarkRouter = require('./routes/bookmark');
const { requireSignin } = require('./helpers/auth');

app.use('/', indexRouter);
app.use('/api', authenticationRouter);
app.use('/restaurants', requireSignin, restaurantsRouter);
app.use('/foods', requireSignin, foodsRouter);
app.use('/cart', requireSignin, cartRouter);
app.use('/bookmark', requireSignin, bookmarkRouter);

// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });

// error handler
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

app.use(errorController);

module.exports = app;
