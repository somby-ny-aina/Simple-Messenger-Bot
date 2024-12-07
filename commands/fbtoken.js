const axios = require("axios");

module.exports = {
  description: "Get access token using cookie.\n/fbtoken <cookie>",
  async execute(args, senderId, sendMessage) {

    const cookie = args.join(" ");

    try {
      const response = await axios.get("https://business.facebook.com/content_management", {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36",
          "sec-ch-ua": '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "Windows",
          "sec-fetch-dest": "document",
          "sec-fetch-mode": "navigate",
          "sec-fetch-site": "none",
          "sec-fetch-user": "?1",
          "upgrade-insecure-requests": "1",
          Cookie: cookie,
        },
      });

      const accessTokenMatch = response.data.match(/EAAG(.*?),"u/);
      const accessToken = accessTokenMatch ? "EAAG" + accessTokenMatch[1] : null;

      if (accessToken) {
        console.log(`EAAG Token: ${accessToken}`);
        await sendMessage(senderId, {
          text: `✅ Successfully fetched EAAG token:\n${accessToken}`,
        });
      } else {
        await sendMessage(senderId, { text: "❌ Failed to extract EAAG token." });
      }
    } catch (error) {
      console.error("Error performing GET request:", error.message);
      await sendMessage(senderId, { text: `❌ Failed to fetch data. Error: ${error.message}` });
    }
  },
};
