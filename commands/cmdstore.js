const axios = require("axios");

module.exports = {
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
          `🆔 ID: ${cmd.id}\n📜 Command: ${cmd.cmdName}\n🔗 Code Link: ${cmd.codeLink}\nℹ️ Description: ${cmd.description}\n🔢 Number: ${cmd.number}`
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
