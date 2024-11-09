const axios = require('axios');

module.exports = {
  execute: async (args, senderId, sendMessage, event) => {
    if (args[0] === 'gen') {
      try {
        const response = await axios.get('https://c-v1.onrender.com/tempmail/gen');
        
        if (response.data && response.data.email) {
          const tempEmail = response.data.email;
          await sendMessage(senderId, { text: `📧 Temp Email Generated: ${tempEmail}` });
        } else {
          await sendMessage(senderId, { text: "❌ Failed to generate temp email." });
        }
      } catch (error) {
        console.error("Error generating temp email:", error.message);
        await sendMessage(senderId, { text: "❌ Error generating temp email." });
      }
    } else if (args[0] === 'check') {
      if (!args[1]) return sendMessage(senderId, { text: "❌ Please provide an email to check after /tempmail check." });

      const emailToCheck = args[1]; // Use the email passed in the args

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
    } else {
      await sendMessage(senderId, { text: "❌ Invalid command. Use /tempmail gen or /tempmail check [email]." });
    }
  }
};
