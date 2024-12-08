const axios = require("axios");

module.exports = {
  description: "/fbshare <access_token> <link> <share_amount>",
  async execute(args, senderId, sendMessage) {
    
    const [accessToken, shareUrl, shareCount] = args.map((item) => item.trim());

    if (!accessToken || !shareUrl || !shareCount) {
      return sendMessage(senderId, {
        text: "❌ All fields (accessToken, shareUrl, shareCount) must be provided.",
      });
    }

    if (isNaN(shareCount)) {
      return sendMessage(senderId, {
        text: "❌ The share count must be a valid number.",
      });
    }

    try {
      const response = await axios.post(
        "https://simple-messenger-bot-cvg1.onrender.com/somby-share",
        {
          accessToken: accessToken,
          shareUrl: shareUrl,
          shareCount: parseInt(shareCount),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        await sendMessage(senderId, {
          text: `✅ Sharing posts in progress... ${shareCount} posts will be shared.`,
        });
      } else {
        await sendMessage(senderId, {
          text: `❌ Something went wrong: ${response.data.message || "Unknown error"}`,
        });
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      await sendMessage(senderId, {
        text: `❌ Failed to share posts: ${error.response?.data?.error?.message || error.message}`,
      });
    }
  },
};
