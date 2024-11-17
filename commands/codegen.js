const description = `Generates code snippets based on a language and query. Usage: /codegen [language] | [query]`;

module.exports = {
  description,
  execute: async (args, senderId, sendMessage) => {
    if (args.length < 2) {
      return sendMessage(senderId, { text: "❌ Usage: /codegen [language] | [query]" });
    }

    const lang = args[0];
    const codeQuery = args.slice(1).join(" ");
    const apiUrl = `https://joshweb.click/api/codegpt?type=code&lang=${encodeURIComponent(lang)}&query=${encodeURIComponent(codeQuery)}`;

    try {
      const response = await require("axios").get(apiUrl);
      const generatedCode = response.data.result || "❌ No response received from the API.";

      const formattedCode = `📄 Code for "${lang}":\n\n\`\`\`${lang}\n${generatedCode}\n\`\`\``;

      await sendMessage(senderId, { text: formattedCode });
    } catch (error) {
      console.error("Error in /codegen command:", error.response?.data || error.message);
      await sendMessage(senderId, { text: "❌ An error occurred while generating the code." });
    }
  },
};
