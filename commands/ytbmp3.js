const axios = require('axios');

const description = `Search and download MP3 from YouTube. Usage: /ytbmp3 [title]`;

module.exports = {
  description,
  execute: async (args, senderId, sendMessage) => {
    try {
      if (!args || !args.trim()) {
        return sendMessage(senderId, { text: "❌ Usage: /ytbmp3 [title]" });
      }

      const title = args.trim();
      const searchUrl = `https://apiv2.kenliejugarap.com/ytsearch?title=${encodeURIComponent(title)}`;

      const searchResponse = await axios.get(searchUrl);

      if (!searchResponse.data.status) {
        return sendMessage(senderId, { text: "❌ No videos found for your search." });
      }

      const videos = searchResponse.data.videos;
      if (videos.length === 0) {
        return sendMessage(senderId, { text: "❌ No videos found for the search query." });
      }

      const randomIndex = Math.floor(Math.random() * videos.length);
      const selectedVideo = videos[randomIndex];

      await sendMessage(senderId, {
        text: `Title: "${selectedVideo.title}"\nDuration: ${selectedVideo.duration}\nViews: ${selectedVideo.views}\n\nDownloading MP3...`,
      });

      await downloadMP3(selectedVideo.url, senderId);
      
    } catch (error) {
      console.error("Error in /ytbmp3 command:", error.message);
      await sendMessage(senderId, { text: "❌ An error occurred while fetching the videos." });
    }
  },
};

async function downloadMP3(videoUrl, senderId) {
  try {
    const musicUrl = `https://apiv2.kenliejugarap.com/music?url=${encodeURIComponent(videoUrl)}`;
    const musicResponse = await axios.get(musicUrl);

    if (!musicResponse.data.status) {
      return sendMessage(senderId, { text: "❌ Unable to fetch the MP3 link." });
    }

    const downloadLink = musicResponse.data.response;
    const title = musicResponse.data.title;

    await sendMessage(senderId, {
      text: `🎶 Here's your MP3 download link for "${title}".`,
    });
    sendMessage(senderId, { attachment: { type: "audio", payload: { url: downloadLink, is_reusable: true } } });

  } catch (error) {
    console.error("Error fetching MP3:", error.message);
    await sendMessage(senderId, { text: "❌ An error occurred while fetching the MP3." });
  }
}
