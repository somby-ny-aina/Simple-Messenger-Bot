const axios = require('axios');

module.exports = {
  execute: async (args, senderId, sendMessage, event) => {
    try {
      if (!event.message.reply_to) {
        return sendMessage(senderId, { text: "❌ Please reply to a photo with this command." });
      }

      const replyMessageId = event.message.reply_to.mid;

      if (!event.message.attachments || event.message.attachments[0].type !== "photo") {
        return sendMessage(senderId, { text: "❌ Please reply to a photo with this command." });
      }

      const imageUrl = event.message.attachments[0].url;
      const prompt = args || "Describe this image";

      const response = await axios.get(`https://sandipbaruwal.onrender.com/gemini2`, {
        params: { prompt: prompt, url: imageUrl }
      });

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
