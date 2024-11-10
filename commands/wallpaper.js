const axios = require("axios");

module.exports = {
  execute: async (args, senderId, sendMessage) => {
    const [query, page] = args.split("|").map(arg => arg.trim());
    
    if (!query || !page) {
      return sendMessage(senderId, { text: "❌ Please provide both a search query and a page number, e.g., /wallpaper batman