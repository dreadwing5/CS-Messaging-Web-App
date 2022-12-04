const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  conversationId: {
    type: String,
  },
  senderId: {
    type: String,
  },
  text: {
    type: String,
  },
  status: {
    type: String,
    enum: ['read', 'unread'],
    default: 'unread',
  },
  sendStatus: {
    type: Number,
    enum: [0, 1], // 0 for not sent, 1 for not-sent
    default: 0,
  },
  sendTime: {
    type: Date,
    default: Date.now,
  },
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
