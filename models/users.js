const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const UsersModel = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Enter a username.'],
      unique: [true, 'That username is taken.'],
      lowercase: true,
      validate: {
        validator: function (val) {
          let pattern = /^([a-z]+[0-9]+|[a-z]+[0-9]+[a-z0-9]+)$/;
          return validator.matches(val, pattern);
        },
        message: 'Usernames may  have letters  and numbers',
      },
    },
    email: {
      type: String,
      required: [true, 'Enter an email address.'],
      unique: [true, 'That email address is taken.'],
      lowercase: true,
      validate: [validator.isEmail, 'Enter a valid email address.'],
    },
    password: {
      type: String,
      required: [true, 'Enter a password.'],
      minLength: [8, 'Password should be at least eight characters'],
      validate: {
        validator: function (val) {
          let pattern =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
          return validator.matches(val, pattern);
        },
        message:
          'Password only have at least one uppercase letter, one lowercase letter, one number and one special character:',
      },
    },
  },
  {
    timestamps: true,
  }
);

UsersModel.pre('save', async function (next) {
  this.password = await bcrypt.hashSync(this.password, 12);
  next();
});

const Users = mongoose.model('users', UsersModel);

module.exports = Users;
