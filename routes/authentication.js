const express = require('express');
const Users = require('../models/users');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// const restaurants = require('../init_data/restaurants.json');

router.post('/register', async function (req, res, next) {
  const { username, email, password } = req.body;
  const user = new Users();
  try {
    user.username = username;
    user.email = email;
    user.password = password;
    const userSave = await user.save();
    if (userSave) {
      // let token = jwt.sign({ data: userSave }, process.env.PRIVATE_KEY, {
      //   expiresIn: '1h',
      // });
      res.status(201).send({
        status: true,
        massege: 'user register successfully',
        // data: token,
      });
    }
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Users.findOne({ $or: [{ username: email }, { email }] });

    if (user) {
      const match = await bcrypt.compareSync(password, user.password);
      if (!match) {
        return res.json({
          errors: {
            field: 'password',
            msg: 'Wrong password',
          },
        });
      }

      let token = jwt.sign({ data: user }, process.env.PRIVATE_KEY, {
        expiresIn: '90d',
      });
      res.status(201).send({
        status: true,
        massege: 'user login successfully',
        data: token,
      });
    } else {
      return res.json({
        errors: {
          field: 'email',
          msg: 'No user found',
        },
      });
    }
  } catch (error) {
    res.status(409).send('user login faild error');
  }
});

module.exports = router;
