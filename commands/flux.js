const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const description = `/flux <prompt>
Example: /flux cut cat`;

module.exports = { description, 
  execute: async (prompt, senderId, sendMessage) => {
    if (!prompt) {
      return sendMessage(senderId, { text: "❌ Please provide a prompt after /flux." });
    }

    try {
      const imageUrl = `https://api.joshweb.click/api/flux?prompt=${encodeURIComponent(prompt)}&model=1`;

       const imgPath = `https://genosite-w0aa.onrender.com/convert-webp-to-jpg?imageUrl=${imageUrl}`;
          
          await sendMessage(senderId, {
            attachment: { type: "image", payload: { url: imgPath, is_reusable: true } }
          });
          
        } catch (error) {
          console.error("Error:", error.message);
          sendMessage(senderId, { text: "❌ Error." });
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