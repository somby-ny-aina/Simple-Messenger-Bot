const axios = require("axios");

module.exports = {
  description: "Generate an image using SDXL API.\nUsage: /generate <number> | <prompt>",
  async execute(prompt, senderId, sendMessage) {
    const [modelNumber, userPrompt] = prompt.split("|").map((p) => p.trim());

    if (!modelNumber || !userPrompt) {
      return sendMessage(senderId, { text: "❌ Usage: /generate <modelnumber> | <prompt>" });
    }

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

    const modelIndex = parseInt(modelNumber, 10) - 1;

    if (isNaN(modelIndex) || modelIndex < 0 || modelIndex >= models.length) {
      return sendMessage(senderId, {
        text: `❌ Invalid model number. Use one of the following:\n${models
          .map((model, index) => `${index + 1}. ${model}`)
          .join("\n")}`,
      });
    }

    const selectedModel = models[modelIndex];

    try {
      await sendMessage(senderId, { text: `⏳ Generating image using the model: ${selectedModel}...` });

      const response = `https://kaiz-apis.gleeze.com/api/sdxl?prompt=${encodeURIComponent(userPrompt)}&model=${selectedModel}`;
      await sendMessage(senderId, {
          attachment: {
            type: "image",
            payload: {
              url: `https://genosite-w0aa.onrender.com/convert-webp-to-jpg?imageUrl=${response}`,
              is_reusable: true,
            },
          },
        });
    
    } catch (error) {
      console.error("Error generating image:", error.message);
      await sendMessage(senderId, { text: "❌ Error generating image. Please try again later." });
    }
  },
};
