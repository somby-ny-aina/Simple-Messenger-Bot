const axios = require("axios");

module.exports = {
  execute: async (args, senderId, sendMessage) => {
    const [query, pass] = args.split("|").map(arg => arg.trim());

    if (!query || !pass) {
      return sendMessage(senderId, { text: "❌ Please provide both a search query and password separated with |" });
    }

    if (pass === "thecornvd") {
      try {
        const response = await axios.get(`https://p-hub-beta.vercel.app/kshitiz`, {
          params: {
            query: query
          }
        });

        const data = response.data;

        if (Array.isArray(data) && data.length > 0) {
          const images = data.slice(0, 5);

          for (let image of images) {
            await sendMessage(senderId, {
              attachment: {
                type: "image",
                payload: { url: image, is_reusable: true }
              }
            });
          }
        } else {
          await sendMessage(senderId, { text: "❌ No corn found for your query." });
        }
      } catch (error) {
        console.error("Corn command error:", error.message);
        await sendMessage(senderId, { text: "❌ Error retrieving corn." });
      }
    } else {
      await sendMessage(senderId, { text: "❌ Password incorrect" });
    }
  }
};