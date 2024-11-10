const axios = require('axios');

let awaitingImage = {}; // To track users awaiting an image reply

module.exports = {
  execute: async (prompt, senderId, sendMessage, event) => {
    // Ask the user to send an image by replying to the bot's message
    awaitingImage[senderId] = true;
    return sendMessage(senderId, { text: "🤖 Please reply to this message with an image for description." });
  },

  handleReply: async (senderId, message, sendMessage) => {
    if (awaitingImage[senderId] && message.attachments && message.attachments[0].type === 'image') {
      const imageUrl = message.attachments[0].payload.url;

      try {
        // Make the API request to get the description for the image
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

      // Stop awaiting for an image from this user after the description is provided
      delete awaitingImage[senderId];
    } else if (awaitingImage[senderId]) {
      // If user didn't reply with an image
      await sendMessage(senderId, { text: "❌ Please reply with an image for description." });
    }
  }
};
