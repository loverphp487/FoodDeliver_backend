const { expressjwt } = require('express-jwt');
const jwt = require('jsonwebtoken');

// middleware
exports.requireSignin = expressjwt({
  secret: process.env.PRIVATE_KEY,
  algorithms: ['HS256'],
});

exports.tokenVerification = (req, res, next) => {
  let token = req?.headers?.authorization;
  if (token && token.startsWith('Bearer ')) {
    const Vertoken = token.slice(7, token.length);
    jwt.verify(Vertoken, process.env.PRIVATE_KEY, function (error, decoded) {
      if (error) {
        res.status(401).send({
          status: false,
          message: error?.name ? error.name : 'Invalid token',
          error: `Invalid token ${error.message}`,
        });
      } else {
        req['user'] = decoded.data;
        next();
      }
    });
  } else {
    res.status(401).send({
      status: false,
      message: 'Token is missing',
      error: 'Token is missing',
    });
  }
};
