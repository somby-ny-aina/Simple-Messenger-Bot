const axios = require('axios');

module.exports = {
  execute: async (args, senderId, sendMessage, event) => {
    try {
      // Ensure this is a reply to a message with a photo attachment
      if (
        !event.message ||
        !event.message.reply_to ||
        !event.message.reply_to.attachments ||
        !event.message.reply_to.attachments[0] ||
        event.message.reply_to.attachments[0].type !== "photo"
      ) {
        return sendMessage(senderId, { text: "❌ Please reply to a photo with this command." });
      }

      const imageUrl = event.message.reply_to.attachments[0].url;
      const prompt = args || "Describe this image";

      // Make the request to the description API
      const response = await axios.get(`https://sandipbaruwal.onrender.com/gemini2`, {
        params: { prompt, url: imageUrl }
      });

      // Check if the response contains a result
      if (response.data && response.data.result) {
        const description = response.data.result;
        await sendMessage(senderId, { text: description });
      } else {
        await sendMessage(senderId, { text: "❌ Failed to describe the image." });
      }
    } catch (error) {
      console.error("Error in describe command:", error.message);
      await sendMessage(senderId, { text: "❌ An error occurred while describing the image." });
    }
  }
};
