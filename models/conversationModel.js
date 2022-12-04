const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
    },
    messages: [],
    status: {
      type: String,
      enum: ['active', 'closed'],
      default: 'active',
    },
  },
  { timestamps: true }
);

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;
