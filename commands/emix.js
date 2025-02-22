const axios = require("axios");

const description = `/emix e1 e2
Example: /emix 😥 🥴`;

module.exports = { description, 
  execute: async (prompt, senderId, sendMessage) => {
    if (!prompt) {
      return sendMessage(senderId, { text: "❌ Please provide a prompt after /emix." });
    }

    const [e1, e2] = prompt.split(' ').map(item => item.trim());

     if (!e1 || !e2) return sendMessage(senderId, { text: "Please two emoji separated by space." });

    try {
      const response = `https://kaiz-apis.gleeze.com/api/emojimix?emoji1=${e1}&emoji2=${e2}`;
      
      await sendMessage(senderId, {
            attachment: { type: "image", payload: { url: response, is_reusable: true } }
          });
        
    } catch (error) {
      console.error("Error generating image:", error.message);
      sendMessage(senderId, { text: "❌ Error generating image." });
    }
  }
};