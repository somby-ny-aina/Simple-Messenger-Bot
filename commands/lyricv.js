const axios = require("axios");

module.exports = {
  execute: async (prompt, senderId, sendMessage) => {
    if (!prompt) {
      return sendMessage(senderId, { text: "❌ Please provide a search query after /lyricv." });
    }

    try {
      const response = await axios.get(`https://lyric-search-neon.vercel.app/kshitiz`, { params: { keyword: prompt } });
      const videos = response.data;

      if (videos && Array.isArray(videos) && videos.length > 0) {
        const selectedVideo = videos[Math.floor(Math.random() * videos.length)];
        
        const { videoUrl } = selectedVideo;

        await sendMessage(senderId, {
          attachment: { type: "video", payload: { url: videoUrl, is_reusable: true } }
        });
      } else {
        sendMessage(senderId, { text: `❌ No videos found for "${query}".` });
      }
    } catch (error) {
      console.error("Error fetching video:", error.message);
      sendMessage(senderId, { text: "❌ Error fetching video." });
    }
  }
};
