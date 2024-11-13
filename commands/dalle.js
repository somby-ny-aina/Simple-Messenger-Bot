const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  execute: async (prompt, senderId, sendMessage) => {
    if (!prompt) {
      return sendMessage(senderId, { text: "❌ Please provide a prompt after /bing." });
    }

    try {
      const response = await axios.get(`https://jerome-web.onrender.com/service/api/dalle2-image`, {
        params: { prompt: prompt }
      });

      const data = response.data;

      if (data.status === "success" && data.data.status === "completed") {
        const imageUrl = data.data.images[0];

        try {
          const imgResponse = await axios.get(imageUrl, { responseType: "arraybuffer" });
          
          const imgPath = path.join(__dirname, "cache", "output.jpg");
          
          await fs.outputFile(imgPath, imgResponse.data);
          
          await sendMessage(senderId, {
            attachment: { type: "image", payload: { url: imgPath, is_reusable: true } }
          });
          
          fs.unlinkSync(imgPath);
        } catch (error) {
          console.error("Error saving image:", error.message);
          sendMessage(senderId, { text: "❌ Error saving image." });
        }
      } else {
        sendMessage(senderId, { text: "❌ Failed to generate image." });
      }
    } catch (error) {
      console.error("Error generating image:", error.message);
      sendMessage(senderId, { text: "❌ Error generating image." });
    }
  }
};
