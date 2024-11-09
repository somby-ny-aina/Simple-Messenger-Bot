const axios = require('axios');
const { sendMessage } = require('../utils');

let tempEmail = null; // Variable to store the generated temporary email

module.exports = {
  // Generate a temporary email address
  generateTempMail: async (args, senderId, sendMessage) => {
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

  // Check the temporary email inbox for a specific email
  checkTempInbox: async (args, senderId, sendMessage) => {
    const emailToCheck = args[0] || tempEmail; // Use the passed email or the generated one
    
    if (!emailToCheck) {
      return sendMessage(senderId, { text: "⚠️ Please generate an email first using `/tempmail gen`." });
    }

    try {
      const response = await axios.get(`https://c-v1.onrender.com/tempmail/inbox?email=${encodeURIComponent(emailToCheck)}`);
      
      if (response.data && response.data.length > 0) {
        const inboxMessages = response.data.map((mail, index) => 
          `─────────────────────\n📩 ${index + 1}. From: ${mail.sender}\nSubject: ${mail.subject}\n\nMessage:\n${mail.message}\n─────────────────────`
        ).join('\n\n\n');

        return sendMessage(senderId, { text: `📬 Inbox for ${emailToCheck}:\n${inboxMessages}` });
      } else {
        return sendMessage(senderId, { text: `📭 Inbox for ${emailToCheck} is empty.` });
      }
    } catch (error) {
      console.error("Error checking inbox:", error);
      return sendMessage(senderId, { text: "❌ Error checking inbox." });
    }
  }
};
