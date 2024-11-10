const axios = require("axios");

module.exports = {
  execute: async (prompt, senderId, sendMessage) => {
    if (!prompt) return sendMessage(senderId, { text: "❌ Please provide a prompt after /snoop." });

      const response = `https://sandipbaruwal.onrender.com/snoop?text=${encodeURIComponent(prompt)}`;
      const imageUrl = response.data;

      sendMessage(senderId, { attachment: { type: "audio", payload: { url: imageUrl, is_reusable: true } } });
  }
};