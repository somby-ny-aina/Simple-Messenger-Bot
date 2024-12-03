const axios = require("axios");

let faceSwapQueue = {};

module.exports = {
  description: "Swap faces between two images. Usage: /faceswap",
  execute: async (args, senderId, sendMessage, event) => {
    // Ensure face swap logic runs only for the right command
    if (args[0] === "faceswap") {
      if (!faceSwapQueue[senderId]) {
        // Start the flow by requesting the target photo
        faceSwapQueue[senderId] = { stage: 1 };
        await sendMessage(senderId, { text: "📸 Please send the target photo for the face swap." });
      } else if (faceSwapQueue[senderId].stage === 1 && event.message.attachments) {
        const targetPhoto = event.message.attachments[0];
        if (targetPhoto.type === "image") {
          // Save target photo and ask for the source photo
          faceSwapQueue[senderId] = { stage: 2, targetUrl: targetPhoto.payload.url };
          await sendMessage(senderId, { text: "🔄 Now send the **source photo** for the face swap." });
        } else {
          await sendMessage(senderId, { text: "❌ Invalid target photo. Please send a valid image." });
        }
      } else if (faceSwapQueue[senderId].stage === 2 && event.message.attachments) {
        const sourcePhoto = event.message.attachments[0];
        if (sourcePhoto.type === "image") {
          // Perform face swap
          const { targetUrl } = faceSwapQueue[senderId];
          const sourceUrl = sourcePhoto.payload.url;

          try {
            // Call the face swap API
            const responseUrl = `https://kaiz-apis.gleeze.com/api/faceswap-v2?targetUrl=${encodeURIComponent(
              targetUrl
            )}&sourceUrl=${encodeURIComponent(sourceUrl)}`;

            // Send the swapped image back
            await sendMessage(senderId, {
              attachment: {
                type: "image",
                payload: {
                  url: responseUrl,
                  is_reusable: true,
                },
              },
            });
          } catch (error) {
            console.error("Face swap error:", error.message);
            await sendMessage(senderId, { text: "❌ An error occurred during the face swap." });
          } finally {
            // Clean up the user's session
            delete faceSwapQueue[senderId];
          }
        } else {
          await sendMessage(senderId, { text: "❌ Invalid source photo. Please send a valid image." });
        }
      } else {
        // Handle invalid operation or reset the session
        await sendMessage(senderId, { text: "❌ Invalid operation. Start over by sending /faceswap." });
        delete faceSwapQueue[senderId];
      }
    } else {
      // If another command is triggered, stop execution
      return;
    }
  },
};
