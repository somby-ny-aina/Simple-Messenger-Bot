const axios = require("axios");

module.exports = {
  execute: async (prompt, senderId, sendMessage) => {
    try {
      const response = await axios.get("https://api.ipify.org?format=json");
      const data = response.data;

      if (data && data.ip) {
        const message = `🌍 Your IP Address 🌍\n\n➤ IP: ${data.ip}`;
        await sendMessage(senderId, { text: message });
      } else {
        await sendMessage(senderId, { text: "❌ Could not retrieve your IP address." });
      }
    } catch (error) {
      console.error("Error retrieving IP address:", error.message);
      await sendMessage(senderId, { text: "❌ Error retrieving IP address. Please try again later." });
    }
  }
};