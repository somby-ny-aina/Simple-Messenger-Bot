const axios = require('axios');

module.exports = {
  execute: async (prompt, senderId, sendMessage) => {
    try {
      const response = await axios.get(`https://jerome-web.onrender.com/service/api/bing`, {
        params: { prompt: encodeURIComponent(prompt) }
      });

      if (response.data.success) {
        const images = response.data.result;

        if (images.length > 0) {
          for (const imageUrl of images) {
            await sendMessage(senderId, { attachment: { type: "image", payload: { url: imageUrl } } });
          }
        } else {
          await sendMessage(senderId, { text: "❌ No image results found for this query." });
        }
      } else {
        await sendMessage(senderId, { text: "❌ Failed to generate images via Bing API." });
      }
    } catch (error) {
      console.error('Error generating Bing images:', error.message);
      await sendMessage(senderId, { text: "❌ An error occurred while generating images." });
    }
  }
};