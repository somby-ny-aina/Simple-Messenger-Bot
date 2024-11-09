const axios = require("axios");

module.exports = {
  execute: async (prompt, senderId, sendMessage) => {
    if (!prompt) return sendMessage(senderId, { text: "❌ Please provide a prompt after /ephoto." });

    // Split the prompt by '|' to get the text and the number
    const [text, number] = prompt.split('|').map(item => item.trim());

    if (!text || !number) return sendMessage(senderId, { text: "❌ Please provide both a prompt and a number after /ephoto." });

    try {
      const response = await axios.get(`https://e-photo.vercel.app/kshitiz`, { params: { text, number } });
      const imageUrl = response.data.ing;

      if (imageUrl) {
        await sendMessage(senderId, { attachment: { type: "image", payload: { url: imageUrl, is_reusable: true } } });
      } else {
        sendMessage(senderId, { text: "❌ Failed to generate image." });
      }
    } catch (error) {
      console.error("Generate error:", error.message);
      sendMessage(senderId, { text: "❌ Error generating image." });
    }
  }
};
