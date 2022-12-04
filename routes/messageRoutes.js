const router = require('express').Router();
const Message = require('../models/messageModel');
const Conversation = require('../models/conversationModel');

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

//find all messages
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

// router.post('/simulate',async  (req, res)=>{

//   try{
//     const userId = await

//   }catch{

//   }

// })

module.exports = router;
