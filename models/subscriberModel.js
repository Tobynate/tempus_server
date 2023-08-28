const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const { Schema } = mongoose;

const subscriberSchema = new Schema({

  fileNumber: {
    type: String,
    unique: true,
    trim: true
  },

}, {
  timestamps: true,
});





const Subscriber = mongoose.model('Subscriber', subscriberSchema);

module.exports = Subscriber;
