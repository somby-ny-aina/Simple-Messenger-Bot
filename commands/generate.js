const axios = require("axios");

const description = `/generate <prompt>\nE.g: /generate cat`;

module.exports = {
  description,
  execute: async (prompt, senderId, sendMessage) => {
    if (!prompt) {
      return sendMessage(senderId, { text: "❌ Please provide a prompt after /generate." });
    }

    try {
      const imageUrl = `https://api.kenliejugarap.com/flux-disney/?prompt=${encodeURIComponent(prompt)}`;

      await sendMessage(senderId, {
        attachment: {
          type: "image",
          payload: {
            url: imageUrl,
            is_reusable: true,
          },
        },
      });
    } catch (error) {
      console.error("Generate error:", error.message);
      sendMessage(senderId, { text: "❌ Error generating image." });
    }
  },
};