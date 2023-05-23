const express = require('express');
const { tokenVerification } = require('../helpers/auth');
const Foods = require('../models/foods');
const router = express.Router();

router.get('/:foodId', tokenVerification, async (req, res) => {
  try {
    if (req?.params?.foodId) {
      const food = await Foods.findOne({ _id: req?.params?.foodId });
      res.status(200).send(food);
    } else {
      res.send('no food found');
    }
  } catch (error) {
    res.send('no food found');
  }
});

module.exports = router;
