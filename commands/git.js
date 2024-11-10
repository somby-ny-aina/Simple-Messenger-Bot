const axios = require("axios");

module.exports = {
  execute: async (prompt, senderId, sendMessage) => {
    // Replace with your ID
    if (senderId !== '6881956545251284') {
      return sendMessage(senderId, { text: "❌ You are not authorized to perform this action." });
    }

    const [filename, fileContent] = prompt.split('|').map(item => item.trim());
    if (!filename || !fileContent) {
      return sendMessage(senderId, { text: "❌ Please provide both the filename and file content in the format: /git filename | file_content." });
    }

    const githubToken = process.env.GITHUB_TOKEN;
    const repoOwner = "somby-ny-aina";    // Replace with your GitHub username
    const repoName = "Simple-Messenger-Bot";   // Replace with your GitHub repository name
    const branch = "main";

    try {
      const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/commands/${filename}`;

      const { data: fileData } = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${githubToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      });

      const updateData = {
        message: `Update file: ${filename} in /commands/ directory`,
        content: Buffer.from(fileContent).toString("base64"),
        branch: branch,
        sha: fileData.sha,  
      };

      await axios.put(url, updateData, {
        headers: {
          Authorization: `Bearer ${githubToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      });
      await sendMessage(senderId, { text: `✅ Successfully updated file: ${filename} in /commands/ directory.` });

    } catch (error) {
      if (error.response && error.response.status === 404) {
        
        const createData = {
          message: `Add new file: ${filename} to /commands/ directory`,
          content: Buffer.from(fileContent).toString("base64"),
          branch: branch,
        };

        try {
          await axios.put(url, createData, {
            headers: {
              Authorization: `Bearer ${githubToken}`,
              Accept: "application/vnd.github.v3+json",
            },
          });
          await sendMessage(senderId, { text: `✅ Successfully added new file: ${filename} to /commands/ directory.` });
        } catch (createError) {
          console.error("Error creating file on GitHub:", createError.message);
          sendMessage(senderId, { text: "❌ Error creating file on GitHub repository." });
        }
      } else {
        console.error("Error adding/updating file to GitHub:", error.message);
        sendMessage(senderId, { text: "❌ Error adding/updating file on GitHub repository." });
      }
    }
  },
};
