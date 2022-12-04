const router = require('express').Router();
const Conversation = require('../models/conversationModel');

//new conv

router.get('/', async (req, res) => {
  try {
    const conversation = await Conversation.find({});
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/:customerId', async (req, res) => {
  //check if thread already exists
  const conversation = await Conversation.findOne({
    conversationId: req.params.customerId,
  });

  if (conversation) {
    return res.status(400).json({ message: 'Conversation already exists' });
  }

  const newConversation = new Conversation({
    conversationId: req.params.customerId,
    messages: [],
    status: 'active',
  });

  try {
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get conv of a customer
router.get('/:customerId', async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      conversationId: req.params.customerId,
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get conv of all users

module.exports = router;
