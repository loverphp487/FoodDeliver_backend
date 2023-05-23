const HandelDuplicateError = (err, res) => {
  const field = Object.keys(err.keyValue)[0];
  const code = 409;
  const message = `An account with that ${field} already exists.`;
  res.status(code).send({ message, field });
};

//handle field formatting, empty fields, and mismatched passwords
const handleValidationError = (err, res) => {
  let errors = Object.values(err.errors).map((el) => {
    return { fields: el.path, message: el.message };
  });
  let code = 400;
  res.status(code).send({ errors });
};

module.exports = (err, req, res, next) => {
  try {
    if (err.name == 'ValidationError') {
      return handleValidationError(err, res);
    }
    if (err.code && err.code === 11000) {
      return HandelDuplicateError(err, res);
    }
  } catch (err) {
    // next(err);
    // console.log(err);
    res.status(500).send('An unknown error occurred.');
  }
};
