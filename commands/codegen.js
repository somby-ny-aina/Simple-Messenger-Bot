const description = `Generates code snippets based on a language and query. Usage: /codegpt [language] [query]`;

module.exports = {
  description,
  execute: async (args, senderId, sendMessage) => {
    if (args.length < 2) {
      return sendMessage(senderId, { text: "❌ Usage: /codegpt [language]