const axios = require("axios");

module.exports = {
  description: "Detects whether the input is AI or human-generated.",
  async execute(prompt, senderId, sendMessage) {
    const input = prompt; 

    if (!input) {
      return sendMessage(senderId, {
        text: "❌ Please provide valid input for analysis.",
      });
    }

    const apiUrl = `https://kaiz-apis.gleeze.com/api/aidetector-v2?q=${encodeURIComponent(input)}`;

    try {
      const {
        data: { ai, human, message },
      } = await axios.get(apiUrl);

      const fullResponse = `🤖 AI Generated: ${ai}\n\n🧑‍🎓 Human Generated: ${human}\n\n📃 Message: ${message}`;

      await sendMessage(senderId, { text: fullResponse });
    } catch (error) {
      console.error("❌ Error reaching the AI Detection API:", error.message);

      await sendMessage(senderId, {
        text: "❌ An error occurred while processing your request.",
      });
    }
  },
};
