const express = require('express');
const { tokenVerification } = require('../helpers/auth');
const mongoose = require('mongoose');
const router = express.Router();
const BookMark = require('../models/bookmark');

router.post('/add/:restaurantId', tokenVerification, async (req, res) => {
  try {
    let restaurantId = req?.params?.restaurantId;
    let userId = req?.user?._id;

    const updatedBookmark = await BookMark.create({ restaurantId, userId });

    if (updatedBookmark) {
      let BookmarkResponse = await BookMark.aggregate([
        {
          $match: { userId: new mongoose.Types.ObjectId(userId) },
        },
        {
          $lookup: {
            from: 'restaurants',
            localField: 'restaurantId',
            foreignField: '_id',
            as: 'restaurants',
          },
        },
        {
          $unwind: {
            path: '$restaurants',
          },
        },
      ]);
      res.send({
        status: true,
        message: 'Restaurant Added to Bookmark Successfully',
        bookMark: BookmarkResponse,
      });
    }
  } catch (error) {
    res
      .status(400)
      .send({ status: false, message: 'Restaurant Added to Bookmark Failed' });
  }
});

router.delete('/remove/:restaurantId', tokenVerification, async (req, res) => {
  try {
    let restaurantId = req?.params?.restaurantId;
    let userId = req?.user?._id;

    const BookmarkItem = await BookMark.findOne({ restaurantId, userId });
    if (BookmarkItem) {
      await BookmarkItem.deleteOne({ restaurantId, userId });
      let BookmarkResponse = await BookMark.aggregate([
        {
          $match: { userId: new mongoose.Types.ObjectId(userId) },
        },
        {
          $lookup: {
            from: 'restaurants',
            localField: 'restaurantId',
            foreignField: '_id',
            as: 'restaurants',
          },
        },
        {
          $unwind: {
            path: '$restaurants',
          },
        },
      ]);
      res.send({
        status: true,
        message: 'Restaurant Added to Bookmark Successfully',
        bookMark: BookmarkResponse,
      });
    }
  } catch (error) {
    res
      .status(400)
      .send({ status: false, message: 'Restaurant Added to Bookmark Failed' });
  }
});

module.exports = router;
