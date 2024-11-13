const axios = require("axios");

const description = `/ffinfo <prompt>
Example: /ffinfo Kelly`;


module.exports = {
  execute: async (prompt, senderId, sendMessage) => {
    if (!prompt) {
      return sendMessage(senderId, { text: "❌ Please provide a character name after /ffinfo." });
    }

    try {
      const response = await axios.get(`https://ff-kshitiz.vercel.app/ff`, { params: { character: prompt } });

      const character = response.data;

      if (!character || !character.title) {
        return sendMessage(senderId, { text: `❌ No information found for character: ${prompt}.` });
      }

      const characterInfo = `
      𝗖𝗛𝗔𝗥𝗔𝗖𝗧𝗘𝗥: ${character.title}

      𝗗𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻: ${character.description}

      𝗡𝗮𝗺𝗲: ${character.info.Name}

      𝗣𝗿𝗶𝗰𝗲: ${character.info.Price}

      𝗚𝗲𝗻𝗱𝗲𝗿: ${character.info.Gender}

      𝗔𝗴𝗲: ${character.info.Age}

      𝗗𝗮𝘆 𝗼𝗳 𝗯𝗶𝗿𝘁𝗵: ${character.info["Day of Birth"]}

      𝗢𝗰𝗰𝘂𝗽𝗮𝘁𝗶𝗼𝗻: ${character.info.Occupation}

      𝗛𝗼𝗯𝗯𝘆: ${character.info.Hobby}
      
      𝗔𝗯𝗶𝗹𝗶𝘁𝘆: ${character.info.Ability}
      
      𝗔𝘄𝗮𝗸𝗲𝗻 𝗡𝗮𝗺𝗲: ${character.info["Awaken Name"]}
      
      𝗨𝗻𝗹𝗼𝗰𝗸𝗲𝗱 𝗯𝘆: ${character.info["Unlocked by"]}
      `;

      await sendMessage(senderId, { text: characterInfo });

      const imageUrl = character.image;
      await sendMessage(senderId, {
        attachment: {
          type: "image",
          payload: { url: imageUrl, is_reusable: true }
        }
      });

    } catch (error) {
      console.error("Error fetching character info:", error.message);
      sendMessage(senderId, { text: "❌ An error occurred while fetching character information. Please try again later." });
    }
  }
};
