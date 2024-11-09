const axios = require("axios");

module.exports = {
  execute: async (prompt, senderId, sendMessage) => {
    if (!prompt) return sendMessage(senderId, { text: "❌ Please provide a prompt after /generate." });

    try {
      const response = await axios.get(`https://joshweb.click/aigen`, { params: { prompt } });
      const imageUrl = response.data.result;

      if (imageUrl) {
        await sendMessage(senderId, { attachment: { type: "image", payload: { url: imageUrl, is_reusable: true } } });
      } else {
        sendMessage(senderId, { text: "❌ Failed to generate image." });
      }
    } catch (error) {
      console.error("Generate error:", error.message);
      sendMessage(senderId, { text: "❌ Error generating image." });
    }
  }
};
