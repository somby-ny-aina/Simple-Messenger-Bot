const axios = require("axios");
const sharp = require("sharp");
const fs = require("fs");

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
        const imageUr = data.data.images[0];

        const imageResponse = await axios.get(imageUr, { responseType: "arraybuffer" });
        const imageBuffer = Buffer.from(imageResponse.data, "binary");

        const jpgBuffer = await sharp(imageBuffer).toFormat("jpg").toBuffer();

        const tempFilePath = "./temp_image.jpg";
        fs.writeFileSync(tempFilePath, jpgBuffer);

        await sendMessage(senderId, {
          attachment: { type: "image", payload: { url: tempFilePath, is_reusable: true } }
        });

        fs.unlinkSync(tempFilePath);
      } else {
        sendMessage(senderId, { text: "❌ Failed to generate image." });
      }
    } catch (error) {
      console.error("Error generating image:", error.message);
      sendMessage(senderId, { text: "❌ Error generating image." });
    }
  }
};
