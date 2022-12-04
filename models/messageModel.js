const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
    },
    sender: {
      type: String,
    },
    text: {
      type: String,
    },
    status: {
      type: String,
      enum: ['read', 'unread'],
    },
    sendStatus: {
      type: String,
      enum: ['sent', 'not sent'],
    },
  },
  { timestamps: true }
);

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
