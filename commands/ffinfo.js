const axios = require("axios");

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
      Character: ${character.title}

      Description: ${character.description}

      Name: ${character.info.Name}

      Price: ${character.info.Price}

      Gender: ${character.info.Gender}

      Age: ${character.info.Age}

      Day of Birth: ${character.info["Day of Birth"]}

      Occupation: ${character.info.Occupation}

      Hobby: ${character.info.Hobby}
      
      Ability: ${character.info.Ability}
      
      Awaken Name: ${character.info["Awaken Name"]}
      
      Unlocked by: ${character.info["Unlocked by"]}
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
