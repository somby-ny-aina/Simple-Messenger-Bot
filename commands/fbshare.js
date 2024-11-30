const axios = require("axios");

module.exports = {
  description: "/fbshare <link> | <amount>",
  async execute(args, senderId, sendMessage) {
    const cookie = process.env.cookie;
    const [url, amount] = args.split("|").map((arg) => arg.trim());

    if (!url || !amount) {
      return sendMessage(senderId, {
        text: "❌ Usage: /fbshare <post_url> | <amount>",
      });
    }

    try {
      await sendMessage(senderId, { text: "⏳ Submitting share request..." });

      const response = await axios.post("https://tests-qb46.onrender.com/submit-share", {
        cookie: cookie,
        url: url,
        amount: parseInt(amount, 10),
        interval: 1,
      });

      if (response.data) {
        await sendMessage(senderId, {
          text: `✅ Share request submitted successfully! \nDetails: ${JSON.stringify(response.data)}`,
        });
      } else {
        throw new Error("No response data from the API.");
      }
    } catch (error) {
      console.error("Error submitting share request:", error.response?.data || error.message);
      await sendMessage(senderId, {
        text: `❌ Error submitting share request: ${error.response?.data?.message || error.message}`,
      });
    }
  },
};
