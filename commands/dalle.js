const axios = require("axios");

module.exports = {
  execute: async (prompt, senderId, sendMessage) => {
    if (!prompt) {
      return sendMessage(senderId, { text: "❌ Please provide a prompt after /bing." });
    }

    try {
      const response = await axios.get(`https://jerome-web.onrender.com/service/api/dalle2-image`, {
        params: { prompt: prompt }
      });

      const data = response.data;

      if (data.status === "success" && data.data.status === "completed") {
        const imageUrl = data.data.images[0];
        await sendMessage(senderId, {
          text: "Here is the generated image:",
          attachment: { type: "image", payload: { url: imageUrl, is_reusable: true } }
        });
      } else {
        sendMessage(senderId, { text: "❌ Failed to generate image." });
      }
    } catch (error) {
      console.error("Error generating image:", error.message);
      sendMessage(senderId, { text: "❌ Error generating image." });
    }
  }
};