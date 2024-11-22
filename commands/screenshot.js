const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const description = `/screenshot <url>
Example: /screenshot https://www.facebook.com`;

module.exports = { description, 
  execute: async (prompt, senderId, sendMessage) => {
    if (!prompt) {
      return sendMessage(senderId, { text: "❌ Please provide a prompt after /screenshot." });
    }

    try {
      const aaa = ".site";
      const response = await axios.get(`https://rest-api.joshuaapostol${aaa}/screenshot`, {
        params: {  url: prompt }
      });

      const data = response.data;

      if (data) {
        const imgUrl = data.screenshotURL;

        try {
          await sendMessage(senderId, {
            attachment: { type: "image", payload: { url: imgUrl, is_reusable: true } }
          });
          
        } catch (error) {
          console.error("Error:", error.message);
          sendMessage(senderId, { text: "❌ Error." });
        }
      } else {
        sendMessage(senderId, { text: "❌ Failed screenshot." });
      }
    } catch (error) {
      console.error("Error generating image:", error.message);
      sendMessage(senderId, { text: "❌ Error screenshoting website." });
    }
  }
};
