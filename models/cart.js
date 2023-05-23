const mongoose = require('mongoose');

const CartModel = new mongoose.Schema({
  foodId:{
    type:mongoose.Types.ObjectId,
    ref:'foods'
  },
  userId:{
    type:mongoose.Types.ObjectId,
    ref:'users'
  },
  count: {
    type: Number,
  },
});

const Cart = mongoose.model('cart', CartModel);

module.exports = Cart;
