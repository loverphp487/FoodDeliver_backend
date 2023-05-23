const mongoose = require('mongoose');

const RestaurantsModel = new mongoose.Schema({
  name: String,
  type: String,
  tags: Array,
  location: String,
  distance: Number,
  time: Number,
  images: {
    logo: String,
    poster: String,
    cover: String,
  },
  categories: Array,
});

const Restaurants = mongoose.model('restaurants', RestaurantsModel);

module.exports = Restaurants;
