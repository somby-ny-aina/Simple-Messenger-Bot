const axios = require("axios");

module.exports = {
  execute: async (prompt, senderId, sendMessage) => {
    if (!prompt) return sendMessage(senderId, { text: "❌ Please provide a prompt after /jane." });

      const imageUrl = `https://sandipbaruwal.onrender.com/jane?text=${encodeURIComponent(prompt)}`;

      sendMessage(senderId, { attachment: { type: "audio", payload: { url: imageUrl, is_reusable: true } } });
  }
};