const axios = require('axios');

module.exports = {
  execute: async (prompt, senderId, sendMessage, event) => {
    console.log('Received args:', prompt); // Debugging log

    if (prompt === 'gen') {
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
    } else {
      if (!prompt) return sendMessage(senderId, { text: "❌ Please provide an email to check after /tempmail check." });

      const emailToCheck = prompt
      console.log('Email to check:', emailToCheck);

      try {
        const response = await axios.get('https://c-v1.onrender.com/tempmail/inbox', { params: { email: emailToCheck } });

        if (response.data && response.data.length > 0) {
          const inboxMessages = response.data.map((mail, index) =>
            `───────────────────\n📩 ${index + 1}. From: ${mail.sender}\nSubject: ${mail.subject}\n\nMessage:\n${mail.message}\n───────────────────`
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
  }
};
