const axios = require('axios');

let tempEmail = null;

module.exports = {
  executeGen: async (args, senderId, sendMessage) => {
    try {
      const response = await axios.get('https://c-v1.onrender.com/tempmail/gen');
      
      if (response.data && response.data.email) {
        tempEmail = response.data.email;
        await sendMessage(senderId, { text: `📧 Temp Email Generated: ${tempEmail}` });
      } else {
        await sendMessage(senderId, { text: "❌ Failed to generate temp email." });
      }
    } catch (error) {
      console.error("Error generating temp email:", error.message);
      await sendMessage(senderId, { text: "❌ Error generating temp email." });
    }
  },

  executeCheck: async (args, senderId, sendMessage) => {
    if (!args[0] && !tempEmail) {
      return sendMessage(senderId, { text: "❌ Please provide an email address after /tempmail check or generate a temp email first using /tempmail gen." });
    }

    const emailToCheck = args[0] || tempEmail; // Use the passed email or the generated one

    try {
      const response = await axios.get('https://c-v1.onrender.com/tempmail/inbox', { params: { email: emailToCheck } });
      
      if (response.data && response.data.length > 0) {
        const inboxMessages = response.data.map((mail, index) =>
          `─────────────────────\n📩 ${index + 1}. From: ${mail.sender}\nSubject: ${mail.subject}\n\nMessage:\n${mail.message}\n─────────────────────`
        ).join('\n\n\n');
        
        await sendMessage(senderId, { text: `📬 Inbox for ${emailToCheck}:\n${inboxMessages}` });
      } else {
        await sendMessage(senderId, { text: `📭 Inbox for ${emailToCheck} is empty.` });
      }
    } catch (error) {
      console.error("Error checking inbox:", error.message);
      await sendMessage(senderId, { text: "❌ Error checking inbox." });
    }
  }
};
