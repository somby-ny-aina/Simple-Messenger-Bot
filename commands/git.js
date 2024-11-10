const axios = require("axios");

module.exports = {
  execute: async (prompt, senderId, sendMessage) => {
 
    const allowedId = "6881956545251284";
    if (senderId !== allowedId) {
      return sendMessage(senderId, { text: "❌ You are not authorized to use this command." });
    }

    const githubToken = process.env.GITHUB_TOKEN;
    if (!githubToken) {
      return sendMessage(senderId, { text: "❌ GitHub token is not set in the environment." });
    }

    const [filename, fileContent] = prompt.split('|').map(item => item.trim());

    if (!filename || !fileContent) {
      return sendMessage(senderId, { text: "❌ Please provide both filename and file content in the format: /git filename | file_content." });
    }

    const repoOwner = "somby-ny-aina";
    const repoName = "Simple-Messenger-Bot";
    const branch = "main";
    const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/commands/${filename}`;

    try {
      let sha = null;
      try {
        const fileResponse = await axios.get(url, {
          headers: {
            Authorization: `token ${githubToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        });
        sha = fileResponse.data.sha; 
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log("File does not exist, will be created.");
        } else {
          throw error;
        }
      }

      const data = {
        message: sha ? `Update file: ${filename} in /commands/ directory` : `Add new file: ${filename} to /commands/ directory`,
        content: Buffer.from(fileContent).toString("base64"),
        branch: branch,
        ...(sha && { sha }),
      };

      const response = await axios.put(url, data, {
        headers: {
          Authorization: `token quant${githubToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      });

      if (response.data &&
Fa response.data.content) {
        await sendMessage(senderId, { text: `✅ Successfully ${sha ? "updated" : "added"} file: ${filename} in the /commands/ directory.` });
      } else {
        sendMessage(senderId, { text: "❌ Failed to update or add the file to the repository." });
      }
    } catch (error) {
      console.error("Error adding/updating file to GitHub:", error.message);
      sendMessage(senderId, { text: "❌ Error adding or updating file in GitHub repository." });
    }
  }
};
