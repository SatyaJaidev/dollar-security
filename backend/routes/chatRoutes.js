const express = require('express');
const router = express.Router();
const ChatMessage = require('../models/ChatMessage');
const nodemailer = require('nodemailer');

// POST - Save user message + send alert
router.post('/send-message', async (req, res) => {
  const { message } = req.body;

  try {
    const newMsg = new ChatMessage({ sender: 'user', message });
    await newMsg.save();

    // Send Email Alert to Admin
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.ADMIN_EMAIL,
      to: process.env.ADMIN_EMAIL,
      subject: '🚨 New Chatbot Query',
      text: `User asked: ${message}`,
    });

    res.status(201).json({ success: true, msg: 'Message saved and alert sent' });
  } catch (err) {
    console.error('Error saving chat message:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ GET - All Chat Messages (sorted newest first)
router.get('/messages', async (req, res) => {
  try {
    const messages = await ChatMessage.find().sort({ timestamp: -1 });
    res.json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// ✅ POST - Admin Reply to a User Message
router.post('/reply', async (req, res) => {
  const { replyToId, message } = req.body;

  try {
    const replyMsg = new ChatMessage({ sender: 'admin', message });
    await replyMsg.save();

    // Mark the original user message as responded
    await ChatMessage.findByIdAndUpdate(replyToId, { responded: true });

    res.status(201).json({ success: true, msg: 'Reply saved and original message marked as responded' });
  } catch (err) {
    console.error('Error sending reply:', err);
    res.status(500).json({ error: 'Failed to send reply' });
  }
});

module.exports = router;
