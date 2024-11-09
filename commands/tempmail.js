const axios = require('axios');
const { sendMessage } = require('../utils');

let tempEmail = null;

module.exports = {
  generateTempMail: async (args, senderId, sendMessage, event) => {
    try {
      const response = await axios.get('https://c-v1.onrender.com/tempmail/gen');
      
      if (response.data && response.data.email) {
        tempEmail = response.data.email;
        return sendMessage(senderId, { text: `📧 Temp Email Generated: ${tempEmail}` });
      } else {
        return sendMessage(senderId, { text: "❌ Failed to generate temp email." });
      }
    } catch (error) {
      console.error("Error generating temp email:", error);
      return sendMessage(senderId, { text: "❌ Error generating temp email." });
    }
  },

  checkTempInbox: async (args, senderId, sendMessage, event) => {
    if (!tempEmail) {
      return sendMessage(senderId, { text: "⚠️ Please generate an email first using `/tempmail gen`." });
    }

    try {
      const response = await axios.get(`https://c-v1.onrender.com/tempmail/inbox?email=${encodeURIComponent(tempEmail)}`);
      
      if (response.data && response.data.inbox && response.data.inbox.length > 0) {
        const inboxMessages = response.data.inbox.map((mail, index) => `📩 ${index + 1}. From: ${mail.sender}\nSubject: ${mail.subject}\n\nMessage:\n${mail.message}`).join('\n\n\n');
        return sendMessage(senderId, { text: `📬 Inbox for ${tempEmail}:\n${inboxMessages}` });
      } else {
        return sendMessage(senderId, { text: `📭 Inbox for ${tempEmail} is empty.` });
      }
    } catch (error) {
      console.error("Error checking inbox:", error);
      return sendMessage(senderId, { text: "❌ Error checking inbox." });
    }
  }
};
