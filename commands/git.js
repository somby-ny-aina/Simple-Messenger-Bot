const axios = require("axios");

module.exports = {
  execute: async (prompt, senderId, sendMessage) => {
    
    const allowedSenderId = "6881956545251284";
    if (senderId !== allowedSenderId) {
      return sendMessage(senderId, { text: "❌ You are not authorized to use this command." });
    }

    const githubToken = process.env.GITHUB_TOKEN;
    if (!githubToken) {
      return sendMessage(senderId, { text: "❌ GitHub token is not set in the environment." });
    }

    const [filename, fileContent] = prompt.split(' | ').map(item => item.trim());

    if (!filename || !fileContent) {
      return sendMessage(senderId, { text: "❌ Please provide both filename and file content in the format: /git filename | file_content." });
    }

    const repoOwner = "somby-ny-aina";   // Replace with your GitHub username
    const repoName = "Simple-Messenger-Bot";  // Replace with your GitHub repository name
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
