const mongoose = require('mongoose');

const BookMarkModel = new mongoose.Schema({
  restaurantId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId,
});

const BookMark = mongoose.model('bookmark', BookMarkModel);

module.exports = BookMark;
