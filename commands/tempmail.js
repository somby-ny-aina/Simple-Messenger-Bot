const axios = require('axios');

module.exports = {
  execute: async (args, senderId, sendMessage) => {
    if (!args[0]) return sendMessage(senderId, { text: "❌ Please provide a prompt after /tempmail check." });

    const emailToCheck = args[0]; // Use the email passed in the args

    try {
      const response = await axios.get(`https://c-v1.onrender.com/tempmail/inbox`, { params: { email: emailToCheck } });
      
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
