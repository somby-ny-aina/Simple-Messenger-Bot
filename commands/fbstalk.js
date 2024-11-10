const axios = require("axios");

module.exports = {
  execute: async (userIdOrUsername, senderId, sendMessage) => {
    if (!userIdOrUsername) {
      return sendMessage(senderId, { text: "❌ Please provide a Facebook ID or username after /fbstalk." });
    }

    try {
      const PAGE_ACCESS_TOKEN = process.env.token;
      
      const response = await axios.get(`https://graph.facebook.com/v12.0/${userIdOrUsername}`, {
        params: {
          access_token: PAGE_ACCESS_TOKEN,
          fields: "id,name,profile_pic,location,gender,birthday"
        }
      });

      const data = response.data;

      if (data && data.id) {
        const { id, name, profile_pic, location, gender, birthday } = data;

        let message = `
          🔎 Facebook User Information 🔍
          ➤ Name: ${name || "N/A"}
          ➤ ID: ${id}
          ➤ Gender: ${gender || "N/A"}
          ➤ Birthday: ${birthday || "N/A"}
          ➤ Location: ${location?.name || "N/A"}
        `;

        await sendMessage(senderId, { text: message });

        if (profile_pic) {
          await sendMessage(senderId, {
            attachment: {
              type: "image",
              payload: { url: profile_pic, is_reusable: true }
            }
          });
        }
      } else {
        await sendMessage(senderId, { text: "❌ No data found for this user." });
      }
    } catch (error) {
      console.error("FB Stalk error:", error.message);
      await sendMessage(senderId, { text: "❌ Error retrieving user data. Check if the ID or username is correct and the bot has the required permissions." });
    }
  }
};