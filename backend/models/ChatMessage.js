const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema({
  sender: { type: String, required: true }, // 'user' or 'admin'
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  responded: { type: Boolean, default: false }
});

module.exports = mongoose.model('ChatMessage', ChatMessageSchema);
