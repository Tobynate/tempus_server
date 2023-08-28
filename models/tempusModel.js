const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const { Schema } = mongoose;

const tempusSchema = new Schema({

  temperature: {
    type: String,
    unique: true,
    trim: true
  },

}, {
  timestamps: true,
});





const tempus = mongoose.model('tempus', tempusSchema);

module.exports = tempus;
