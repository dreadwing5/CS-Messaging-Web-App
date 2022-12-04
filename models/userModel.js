const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userID: {
    type: String,
    unique: true,
    required: [true, 'A user must have a userID'],
  },
  role: {
    type: String,
    enum: ['customer', 'agent'],
    default: 'customer',
  },
});
const User = mongoose.model('User', userSchema);

module.exports = User;
