const axios = require("axios");

module.exports = {
  description: "/fbtoken <email> | <password>",
  async execute(prompt, senderId, sendMessage) {
    const [email, pass] = prompt.split("|").map((item) => item.trim());

    if (!email || !pass) {
      return sendMessage(senderId, {
        text: "❌ Both email and password must be provided.",
      });
    }

    try {
      const response = await axios.get(
        "https://simple-messenger-bot-cvg1.onrender.com/somby-token",
        {
          params: {
            email: email,
            pass: pass,
          },
        }
      );

      if (response.data.access_token) {
        await sendMessage(senderId, {
          text: `✅ Token retrieved successfully: ${response.data.access_token}`,
        });
      } else {
        await sendMessage(senderId, {
          text: `❌ Something went wrong: ${response.data.message || "Unknown error"}`,
        });
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);

      const errorDetails = error.response?.data?.details?.error?.message || error.message;
      await sendMessage(senderId, {
        text: `❌ Failed to retrieve token: ${errorDetails}`,
      });
    }
  },
};
