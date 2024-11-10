const axios = require("axios");

module.exports = {
  execute: async (prompt, senderId, sendMessage) => {
    const [githubToken, filename, fileContent] = prompt.split(' | ').map(item => item.trim());

    if (!githubToken || !filename || !fileContent) {
      return sendMessage(senderId, { text: "❌ Please provide all required parameters in the format: /git github_token | filename | file_content." });
    }

    const repoOwner = "somby-ny-aina";
    const repoName = "Simple-Messenger-Bot";
    const branch = "main";

    try {
      const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/commands/${filename}`;
      const data = {
        message: `Add new file: ${filename} to /commands/ directory`,
        content: Buffer.from(fileContent).toString("base64"),
        branch: branch,
      };

      const response = await axios.put(url, data, {
        headers: {
          Authorization: `token ${githubToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      });

      if (response.data && response.data.content) {
        await sendMessage(senderId, { text: `✅ Successfully added file: ${filename} to /commands/ directory in the repository.` });
      } else {
        sendMessage(senderId, { text: "❌ Failed to add the file to the repository." });
      }
    } catch (error) {
      console.error("Error adding file to GitHub:", error.message);
      sendMessage(senderId, { text: "❌ Error adding file to GitHub repository." });
    }
  }
};
