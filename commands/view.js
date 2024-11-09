const axios = require('axios');

module.exports = {
  execute: async (args, senderId, sendMessage, event) => {
    try {
      if (!event.message.reply_to || !event.message.reply_to.mid) {
        return sendMessage(senderId, { text: "❌ Please reply to a photo with this command." });
      }

      const replyMessageId = event.message.reply_to.mid;
      const PAGE_ACCESS_TOKEN = process.env.token; // Ensure this token is set

      const originalMessage = await axios.get(
        `https://graph.facebook.com/v12.0/${replyMessageId}`,
        {
          params: { access_token: PAGE_ACCESS_TOKEN }
        }
      );

      const attachments = originalMessage.data.attachments?.data;
      if (!attachments || attachments[0].type !== "image") {
        return sendMessage(senderId, { text: "❌ Please reply to a photo with this command." });
      }

      const imageUrl = attachments[0].payload.url;
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
