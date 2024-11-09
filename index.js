const express = require('express');
const bodyParser = require('body-parser');
const axios = require("axios");
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const PAGE_ACCESS_TOKEN = process.env.token;

const sendMessage = async (senderId, message) => {
  try {
    await axios.post(`https://graph.facebook.com/v21.0/me/messages`, {
      recipient: { id: senderId },
      message
    }, {
      params: { access_token: PAGE_ACCESS_TOKEN },
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error('Error sending message:', error.message);
  }
};

const commands = {};
fs.readdirSync(path.join(__dirname, 'commands')).forEach(file => {
  if (file.endsWith('.js')) {
    const commandName = file.replace('.js', '');
    commands[commandName] = require(`./commands/${file}`);
  }
});

const chatGpt4o = async (text, senderId) => {
  try {
    const response = await axios.get(`https://joshweb.click/api/gpt-4o`, {
      params: { q: text, uid: senderId }
    });
    return response.data.result;
  } catch (err) {
    console.error("GPT-4O error:", err);
    return "❌ An error has occurred.";
  }
};

const handleMessage = async (event) => {
  const senderID = event.sender.id;
  const message = event.message.text;

  if (!senderID || !message) return;

  if (message.toLowerCase() === 'help') {
    const commandList = Object.keys(commands).map(cmd => `/${cmd}`).join('\n');
    const helpMessage = `🤖 Smo bot 🤖\n\n📜 Available commands:\n${commandList}\n\n Use "/" followed by the command name.`;
    return sendMessage(senderID, { text: helpMessage });
  }

  if (message.startsWith('/')) {
    const [cmd, ...args] = message.slice(1).split(' ');
    const command = commands[cmd];
    if (command) {
      return command.execute(args.join(' '), senderID, sendMessage);
    } else {
      return sendMessage(senderID, { text: "❌ Unknown command." });
    }
  } else {
    const botResponse = await chatGpt4o(message, senderID);
    return sendMessage(senderID, { text: botResponse });
  }
};

const handleEvent = async (event) => {
  if (event.message && event.message.text) {
    await handleMessage(event);
  }
};

app.use(bodyParser.json());

app.post('/webhook', (req, res) => {
  const body = req.body;
  if (body.object === 'page') {
    body.entry.forEach(async entry => {
      const webhookEvent = entry.messaging[0];
      await handleEvent(webhookEvent);
    });
    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
});

app.listen(PORT, () => {
  console.log(`Messenger bot is starting. 🤖 🇲🇬`);
});
