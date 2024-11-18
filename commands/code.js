const fs = require('fs');
const path = require('path');

module.exports = {
  description: "/code <filename>",
  execute: async (message, args) => {
    try {
      if (!args[0]) {
        return {
          text: "Please specify the command file name. Example: `code commandName`",
        };
      }

      const commandName = args[0];
      const commandFilePath = path.join(__dirname, `${commandName}.js`);

      if (!fs.existsSync(commandFilePath)) {
        return {
          text: `The command file '${commandName}.js' does not exist.`,
        };
      }

      const fileContent = fs.readFileSync(commandFilePath, 'utf8');

      const maxLength = 2000;
      if (fileContent.length > maxLength) {
        const chunks = [];
        for (let i = 0; i < fileContent.length; i += maxLength) {
          chunks.push(fileContent.substring(i, i + maxLength));
        }
        return chunks.map((chunk, index) => ({
          text: `Part ${index + 1}:\n\`\`\`js\n${chunk}\n\`\`\``,
        }));
      }

      return {
        text: `\`\`\`js\n${fileContent}\n\`\`\``,
      };
    } catch (error) {
      console.error("Error fetching command content:", error);
      return {
        text: "An error occurred while fetching the command content.",
      };
    }
  },
};