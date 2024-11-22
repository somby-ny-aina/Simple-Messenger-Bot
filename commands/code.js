const description = `Usage: /code [filename]`;

module.exports = {
  description,
  execute: async (args, senderId, sendMessage) => {
    const fs = require('fs');
    const path = require('path');

    const allowedSenderId = "6881956545251284";
    if (senderId !== allowedSenderId) {
      return sendMessage(senderId, { text: "❌ You are not authorized to use this command." });
    }

    try {
      if (!args || !args.trim()) {
        return sendMessage(senderId, { text: "❌ Usage: /code [filename]" });
      }

      const commandName = args.trim();
      const commandFilePath = path.join(__dirname, `${commandName}.js`);

      if (!fs.existsSync(commandFilePath)) {
        return sendMessage(senderId, { text: `❌ The command file '${commandName}.js' does not exist.` });
      }

      const fileContent = fs.readFileSync(commandFilePath, 'utf8');

      await sendMessage(senderId, {
        text: `📄 Content of '${commandName}.js':\n\`\`\`js\n${fileContent}\n\`\`\``,
      });
    } catch (error) {
      console.error("Error in /code command:", error.response?.data || error.message);
      await sendMessage(senderId, { text: "❌ An error occurred while fetching the command content." });
    }
  },
};
