const axios = require("axios");
const description = `/ephoto <prompt>
E.g: /snoop Hello World`;


module.exports = { description,
  execute: async (prompt, senderId, sendMessage) => {
    if (!prompt) return sendMessage(senderId, { text: "❌ Please provide a prompt after /snoop." });

      const imageUrl = `https://sandipbaruwal.onrender.com/snoop?text=${encodeURIComponent(prompt)}`;

      sendMessage(senderId, { attachment: { type: "audio", payload: { url: imageUrl, is_reusable: true } } });
  }
};
