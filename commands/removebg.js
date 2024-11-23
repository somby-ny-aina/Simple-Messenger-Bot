const axios = require("axios");

module.exports = {
  execute: async (args, senderId, sendMessage, event) => {
    if (!event || !event.message || !event.message.attachments || event.message.attachments[0].type !== "image") {
      return sendMessage(senderId, { text: "❌ Please send a photo to remove its background." });
    }

    const imageUrl = event.message.attachments[0].payload.url;

    try {
      const response = `https://kaiz-apis.gleeze.com/api/removebg&url=${imageUrl}`;


      if (resultImage) {
        await sendMessage(senderId, {
          attachment: {
            type: "image",
            payload: { url: response, is_reusable: true }
          }
        });
      } else {
        await sendMessage(senderId, { text: "❌ Failed to remove the background from the image." });
      }
    } catch (error) {
      console.error("RemoveBG command error:", error.message);
      await sendMessage(senderId, { text: "❌ Error removing background from the image." });
    }
  }
};