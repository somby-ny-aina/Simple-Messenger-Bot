const axios = require('axios');

module.exports = {
  execute: async (args, senderId, sendMessage, event) => {
    try {
      if (
        event &&
        event.message &&
        event.message.reply_to &&
        event.message.reply_to.attachments &&
        event.message.reply_to.attachments[0] &&
        event.message.reply_to.attachments[0].type === 'image'
      ) {
        const imageUrl = event.message.reply_to.attachments[0].payload.url;
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
      } else {
        await sendMessage(senderId, { text: "❌ Please reply to an image to use this command." });
      }
    } catch (error) {
      console.error("Error in describe command:", error.message);
      await sendMessage(senderId, { text: "❌ An error occurred while describing the image." });
    }
  }
};
