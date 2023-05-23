const express = require('express');
const mongoose = require('mongoose');
const Restaurants = require('../models/restaurants');
const { tokenVerification } = require('../helpers/auth');
const router = express.Router();

router.get('/all', tokenVerification, async (req, res) => {
  try {
    const restaurants = await Restaurants.find({});
    res.send(restaurants);
  } catch (error) {
    console.log(error);
  }
});

router.get('/:restaurantId', tokenVerification, async (req, res) => {
  try {
    if (req?.params?.restaurantId) {
      const restaurantId = req?.params?.restaurantId;
      const restaurant = await Restaurants.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(restaurantId) } },
        {
          $lookup: {
            from: 'foods',
            localField: '_id',
            foreignField: 'restaurantId',
            as: 'foods',
          },
        },
      ]);
      res.send(restaurant);
    } else {
      res.send('restaurant Id could not be empty');
    }
  } catch (error) {
    res.send('no restaurant found');
  }
});

module.exports = router;
