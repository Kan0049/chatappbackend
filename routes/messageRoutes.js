const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

router.get('/:sender/:receiver', async (req, res) => {
  try {
    const { sender, receiver } = req.params;
    console.log(`Fetching messages between sender: ${sender} and receiver: ${receiver}`); // Debug log
    const messages = await Message.find({
      $or: [
        { sender, receiver },
        { sender: receiver, receiver: sender }
      ]
    }).sort({ timestamp: 1 });
    console.log('Fetched messages:', messages); // Debug log
    res.status(200).json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ message: 'Error fetching messages', error: err.message });
  }
});

router.post('/send', async (req, res) => {
  try {
    const messageData = req.body;
    const message = new Message({
      ...messageData,
      isRead: false
    });
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: 'Error sending message', error: err.message });
  }
});

router.post('/read', async (req, res) => {
  try {
    const { messageId } = req.body;
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    message.isRead = true;
    await message.save();
    res.status(200).json({ message: 'Message marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Error marking message as read', error: err.message });
  }
});

module.exports = router;