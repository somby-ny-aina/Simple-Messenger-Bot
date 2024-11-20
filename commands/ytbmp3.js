const axios = require('axios');

const description = `Search and download MP3 from YouTube. Usage: /ytb [title]`;

module.exports = {
  description,
  execute: async (args, senderId, sendMessage) => {
    try {
      if (!args || !args.trim()) {
        return sendMessage(senderId, { text: "❌ Usage: /ytb [title]" });
      }

      const title = args.trim();
      const searchUrl = `https://apiv2.kenliejugarap.com/ytsearch?title=${encodeURIComponent(title)}`;

      const searchResponse = await axios.get(searchUrl);

      if (!searchResponse.data.status) {
        return sendMessage(senderId, { text: "❌ No videos found for your search." });
      }

      const videos = searchResponse.data.videos.slice(0, 6);
      const videoChoices = videos.map((video, index) => ({
        text: `${index + 1}. ${video.title}\nDuration: ${video.duration}\nViews: ${video.views}`,
        videoUrl: video.url,
      }));

      let responseText = "🎬 Here are the top 6 search results:\n";
      videoChoices.forEach((choice) => {
        responseText += `\n${choice.text}`;
      });

      await sendMessage(senderId, { text: responseText });

      // Now wait for user's next message to choose a video by number
      const waitForReply = (message) => {
        const userChoice = parseInt(message.text, 10);
        if (userChoice >= 1 && userChoice <= videoChoices.length) {
          return downloadMP3(videoChoices[userChoice - 1].videoUrl, senderId);
        } else {
          sendMessage(senderId, { text: "❌ Invalid choice. Please choose a number between 1 and 6." });
        }
      };

      return waitForReply;

    } catch (error) {
      console.error("Error in /ytb command:", error.message);
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
      text: `🎶 Here's your MP3 download link for "${title}":\n${downloadLink}\n\nNote: The link will auto-delete after 10 minutes.`,
    });

  } catch (error) {
    console.error("Error fetching MP3:", error.message);
    await sendMessage(senderId, { text: "❌ An error occurred while fetching the MP3." });
  }
}
