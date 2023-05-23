const mongoose = require('mongoose');

const FoodModel = new mongoose.Schema({
  restaurantId: {
    type:mongoose.Types.ObjectId,
    ref:'restaurants'
  },
  name: String,
  price: Number,
  image: String,
  category: String,
  description: String,
  ingredients: String,
});

const Foods = mongoose.model('foods', FoodModel);

module.exports = Foods;
