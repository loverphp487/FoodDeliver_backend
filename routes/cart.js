const express = require('express');
const { tokenVerification } = require('../helpers/auth');
const Cart = require('../models/cart');
const mongoose = require('mongoose');
const router = express.Router();

router.post('/add/:foodId', tokenVerification, async (req, res) => {
  try {
    let foodId = req?.params?.foodId;
    let userId = req?.user?._id;
    const updatedCart = await Cart.updateOne(
      { foodId, userId },
      { $inc: { count: 1 } },
      { upsert: true }
    );

    if (updatedCart.upsertedCount > 0 || updatedCart.matchedCount > 0) {
      let cartResponse = await Cart.aggregate([
        {
          $match: { userId: new mongoose.Types.ObjectId(userId) },
        },
        {
          $lookup: {
            from: 'foods',
            localField: 'foodId',
            foreignField: '_id',
            as: 'foods',
          },
        },
        {
          $unwind: {
            path: '$foods',
          },
        },
      ]);
      res.send({
        status: true,
        message: 'Item Added to Cart Successfully',
        cart: cartResponse,
      });
    }
  } catch (error) {
    res
      .status(400)
      .send({ status: false, message: 'Item Added to Cart Failed' });
  }
});

router.delete('/remove/:foodId', tokenVerification, async (req, res) => {
  try {
    let foodId = req?.params?.foodId;
    let userId = req?.user?._id;

    const cartItem = await Cart.findOne({ foodId, userId, count: 1 });
    if (cartItem) {
      await cartItem.deleteOne({ foodId, userId });
      let cartResponse = await Cart.aggregate([
        {
          $match: { userId: new mongoose.Types.ObjectId(userId) },
        },
        {
          $lookup: {
            from: 'foods',
            localField: 'foodId',
            foreignField: '_id',
            as: 'foods',
          },
        },
        {
          $unwind: {
            path: '$foods',
          },
        },
      ]);
      return res.send({
        status: true,
        message: 'Item Removed from Cart Successfully',
        cart: cartResponse,
      });
    }
    const updatedCart = await Cart.updateOne(
      { foodId, userId },
      { $inc: { count: -1 } },
      { upsert: true }
    );

    if (updatedCart.upsertedCount > 0 || updatedCart.matchedCount > 0) {
      let cartResponse = await Cart.aggregate([
        {
          $match: { userId: new mongoose.Types.ObjectId(userId) },
        },
        {
          $lookup: {
            from: 'foods',
            localField: 'foodId',
            foreignField: '_id',
            as: 'foods',
          },
        },
        {
          $unwind: {
            path: '$foods',
          },
        },
      ]);
      res.send({
        status: true,
        message: 'Item Removed from Cart Successfully',
        cart: cartResponse,
      });
    }
  } catch (error) {
    res
      .status(400)
      .send({ status: false, message: 'Item Removed from Cart Failed' });
  }
});

module.exports = router;
