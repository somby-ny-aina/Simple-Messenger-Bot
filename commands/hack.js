const axios = require("axios");

module.exports = {
  description: "/hack <uid>",

  async execute(prompt, senderId, sendMessage, event, api) {
    try {
      const userId = prompt || 4;

      if (!userId || isNaN(userId)) {
        return sendMessage(senderId, { text: "❌ Please provide a valid Facebook user ID." });
      }

      const response = await axios.get(`https://simple-messenger-bot-cvg1.onrender.com/hack?user_id=${userId}`);
      const url = response.data.download_url;

      if (!url) {
        return sendMessage(senderId, { text: `❌ Failed to generate image: ${message}` });
      }

      await sendMessage(
        senderId,
        {
          attachment: { type: "image", payload : { url: url, is_reusable: true } } 
        } );
    } catch (error) {
      console.error("Error in hack command:", error.message);
      await sendMessage(senderId, { text: `❌ Error: ${error.message}` });
    }
  },
};
