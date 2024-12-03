const axios = require('axios');
const description = `1) Without prompt to get tempmail:
/tempmail

2) Without prompt to check inbox:
/tempmail <tempmail>`;

module.exports = { description,
  execute: async (prompt, senderId, sendMessage, event) => {
    console.log('Received args:', prompt);

    if (prompt === 'gen') {
      try {
        const response = await axios.get('https://temp-mail-eight.vercel.app/tempmail/gen');
        
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
        const response = await axios.get('https://temp-mail-eight.vercel.app/tempmail/message', { params: { email: emailToCheck } });

        if (response.data && response.data.length > 0) {
          const inboxMessages = response.data.map((messages, index) =>
            `───────────────────\n📩 ${index + 1}. From: ${messages.sender}\nSubject: ${messages.subject}\n\nMessage:\n${messages.message}───────────────────`
          ).join('\n\n\n');
          
          await sendMessage(senderId, { text: `📬 Inbox for ${emailToCheck}:\n${inboxMessages}\n` });
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
