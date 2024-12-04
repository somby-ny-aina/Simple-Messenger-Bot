const axios = require('axios');
const description = `1) With prompt 'gen' to get tempmail:
/tempmail gen

2) Without prompt to check inbox:
/tempmail <tempmail>`;

module.exports = {
  description,
  execute: async (prompt, senderId, sendMessage, event) => {
    console.log('Received args:', prompt);

    if (prompt === 'gen') {
      try {
        const response = await axios.get('https://nethwieginedev.vercel.app/api/tempmail-create');

        if (response.data && response.data.address) {
          const tempEmail = response.data.address;
          await sendMessage(senderId, { text: `📧 Temp Email Generated: ${tempEmail}` });
        } else {
          await sendMessage(senderId, { text: "❌ Failed to generate temp email." });
        }
      } catch (error) {
        console.error("Error generating temp email:", error.message);
        await sendMessage(senderId, { text: "❌ Error generating temp email." });
      }
    } else {
      if (!prompt) {
        return sendMessage(senderId, { text: "❌ Please provide an email to check after /tempmail <email>." });
      }

      const emailToCheck = prompt;
      console.log('Email to check:', emailToCheck);

      try {
        const response = await axios.get('https://nethwieginedev.vercel.app/api/tempmail-get', { params: { email: emailToCheck } });

        if (response.data && response.data.status === true) {
          const messages = response.data.messages;

          if (messages.length > 0) {
            const inboxMessages = messages.map((message, index) =>
              `───────────────────\n📩 ${index + 1}. From: ${message.from}\nDate: ${message.date}\nSubject: ${message.subject}\n\nMessage:\n${message.message}\n───────────────────`
            ).join('\n\n');

            await sendMessage(senderId, { text: `📬 Inbox for ${emailToCheck}:\n${inboxMessages}` });
          } else {
            await sendMessage(senderId, { text: `📭 Inbox for ${emailToCheck} is empty.` });
          }
        } else {
          await sendMessage(senderId, { text: "❌ Failed to fetch inbox messages." });
        }
      } catch (error) {
        console.error("Error checking inbox:", error.message);
        await sendMessage(senderId, { text: "❌ Error checking inbox." });
      }
    }
  }
};
