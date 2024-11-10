const axios = require('axios');

let awaitingImage = {}; 

module.exports = {
  execute: async (prompt, senderId, sendMessage, event) => {
    if (!prompt || prompt !== 'describe') {
      return sendMessage(senderId, { text: "❌ Invalid command. Use /describe to start." });
    }

    awaitingImage[senderId] = true;
    return sendMessage(senderId, { text: "🤖 Please reply to this message with an image for description." });
  },

  handleReply: async (senderId, message, sendMessage) => {
    if (awaitingImage[senderId] && message.attachments && message.attachments[0].type === 'image') {
      const imageUrl = message.attachments[0].payload.url;

      try {
        const response = await axios.get(`https://sandipbaruwal.onrender.com/gemini2?prompt=hi&url=${encodeURIComponent(imageUrl)}`);

        if (response.data && response.data.result) {
          await sendMessage(senderId, { text: `🖼️ Description: ${response.data.result}` });
        } else {
          await sendMessage(senderId, { text: "❌ Could not generate description." });
        }
      } catch (error) {
        console.error("Error generating description:", error.message);
        await sendMessage(senderId, { text: "❌ Error generating description." });
      }

      delete awaitingImage[senderId];
    } else if (awaitingImage[senderId]) {
      
      await sendMessage(senderId, { text: "❌ Please reply with an image for description." });
    }
  }
};