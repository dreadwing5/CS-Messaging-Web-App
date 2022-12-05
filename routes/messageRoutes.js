const router = require('express').Router();
const Message = require('../models/messageModel');
const Conversation = require('../models/conversationModel');
const User = require('../models/userModel');

//new message
router.post('/', async (req, res) => {
  const newMessage = {
    conversationId: req.body.userId,
    senderId: req.body.userId,
    text: req.body.text,
    sendStatus: 1,
  };
  const message = new Message(newMessage);
  try {
    const savedMessage = await message.save();
    const conversation = await Conversation.updateOne(
      { userId: req.body.userId },
      { $push: { messages: savedMessage._id } }
    );
    res.status(200).json(savedMessage);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//send one of the saves message of user

router.post('/:userID', async (req, res) => {
  try {
    const messages = await Message.find({
      senderId: req.params.userID,
      sendStatus: 0,
    })
      .sort({ sendTime: 1 })
      .limit(1);

    if (messages.length > 0) {
      message = messages[0];

      // broadcast this message to all available agents
      // update the message status to sent
      message.sendStatus = 1;
      await message.save();
    } else {
      console.log('No message to send');
      return res.status(201).json('No message to send');
    }

    // now save the message to the conversation

    // find the conversation of user, if not found create one

    const conversation = await Conversation.findOne({
      conversationId: req.params.userID,
    });
    if (!conversation) {
      // create new conversation for the user
      const newConversation = new Conversation({
        conversationId: req.params.userID,
        messages: [message._id],
      });
      newConversation.save();
    } else {
      // update the conversation
      conversation.messages.push(message._id);
      await conversation.save();
    }

    res.status(200).json(message);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//find all messages of a particular thread
router.get('/:conversationId', async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
