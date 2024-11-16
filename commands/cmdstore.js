const axios = require("axios");
const description = `/cmdstore <cmd name>
E.g: /cmdstore ai`;

module.exports = { description,
  execute: async (cmdName, senderId, sendMessage) => {
    if (!cmdName) {
      return sendMessage(senderId, { text: "❌ Please provide a command name after /cmdsearch." });
    }

    try {
      const response = await axios.get(`https://cmd-store.vercel.app/kshitiz`);
      const commands = response.data;

      const matchingCommands = commands.filter(cmd => cmd.cmdName.toLowerCase().includes(cmdName.toLowerCase()));

      if (matchingCommands.length > 0) {
        const commandDetails = matchingCommands.map(cmd =>
          `𝗜𝗗: ${cmd.id}\n𝗡𝗮𝗺𝗲: ${cmd.cmdName}\n𝗟𝗶𝗻𝗸: ${cmd.codeLink}\n𝗗𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻: ${cmd.description}\n`
        ).join('\n\n');

        await sendMessage(senderId, { text: `🔍 Results for "${cmdName}":\n\n${commandDetails}` });
      } else {
        sendMessage(senderId, { text: `❌ No commands found for "${cmdName}".` });
      }
    } catch (error) {
      console.error("Error fetching command:", error.message);
      sendMessage(senderId, { text: "❌ Error fetching command information." });
    }
  }
};
