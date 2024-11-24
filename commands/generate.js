const https = require("https");

const models = [
  "3d-model",
  "analog-film",
  "anime",
  "cinematic",
  "comic-book",
  "digital-art",
  "enhance",
  "fantasy-art",
  "isometric",
  "line-art",
  "low-poly",
  "neon-punk",
  "origami",
  "photographic",
  "pixel-art",
  "texture",
  "craft-clay"
];

module.exports = {
  name: "generate",
  description: "Generate an image using Stable Diffusion XL. Format: /generate <modelnumber> | <prompt>",
  execute: async (args, senderId, sendMessage) => {
    const input = args.split("|");
    if (input.length < 2) {
      return sendMessage(senderId, { text: "❌ Invalid format. Use /generate <modelnumber> | <prompt>." });
    }

    const modelIndex = parseInt(input[0].trim()) - 1; 
    const prompt = input[1].trim();

    if (isNaN(modelIndex) || modelIndex < 0 || modelIndex >= models.length) {
      return sendMessage(senderId, { text: `❌ Invalid model number. Choose between 1 and ${models.length}.` });
    }

    const selectedModel = models[modelIndex];
    const apiUrl = `https://kaiz-apis.gleeze.com/api/sdxl?prompt=${encodeURIComponent(prompt)}&model=${selectedModel}`;

    try {
      const imageResponse = await new Promise((resolve, reject) => {
        https.get(apiUrl, (res) => {
          if (res.statusCode === 200) {
            resolve(apiUrl);
          } else {
            reject(new Error(`Failed to fetch image: Status Code ${res.statusCode}`));
          }
        }).on("error", (err) => reject(err));
      });

      await sendMessage(senderId, {
        attachment: {
          type: "image",
          payload: {
            url: imageResponse,
            is_reusable: true
          }
        }
      });
    } catch (error) {
      console.error("Error generating image:", error.message);
      await sendMessage(senderId, { text: "❌ Error generating the image." });
    }
  }
};