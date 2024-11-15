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
const commandCount = Object.keys(commands).length;

const prePrompt = "You are Smo, a helpful assistant that provides informative answers. You never use Latex math formating but use normal text.";


const chatGpt4o = async (text, senderId) => {
  try {
    const response = await axios.get(`https://joshweb.click/api/gpt-4o`, {
      params: { q: `${prePrompt}\n${encodeURIComponent(text)}`, uid: senderId }
    });
    return response.data.result;
  } catch (err) {
    console.error("GPT-4O error:", err);
    return "❌ An error has occurred.";
  }
};
const handleCommand = async (commandName, args, senderId, event) => {
  const command = commands[commandName];
  if (command) {
    await command.execute(args.join(' '), senderId, sendMessage, event);
  } else {
    await sendMessage(senderId, { text: "❌ Unknown command." });
  }
};

let pendingImageDescriptions = {};

const describeImage = async (imageUrl, prompt, senderId) => {
  try {
    const response = await axios.get(`https://sandipbaruwal.onrender.com/gemini2`, {
      params: { url: imageUrl, prompt: prompt }
    });
    const description = response.data.answer;
    await sendMessage(senderId, { text: description || "❌ Could not describe the image." });
  } catch (error) {
    console.error("Image description error:", error.message);
    await sendMessage(senderId, { text: "❌ Error describing image." });
  }
};

const handleMessage = async (event) => {
  const senderID = event.sender.id;
  const message = event.message.text;

  if (!senderID || !message) return;

  if (pendingImageDescriptions[senderID]) {
    const imageUrl = pendingImageDescriptions[senderID];
    delete pendingImageDescriptions[senderID];
    return describeImage(imageUrl, message, senderID);
  }

  if (message.toLowerCase().startsWith('cmdlist')) {
    const args = message.split(' ');
    if (args.length > 1) {
      const commandName = args[1];
      const command = commands[commandName];
      if (command && command.description) {
        return sendMessage(senderID, { text: `📄 Description for /${commandName}: \n${command.description}` });
      } else {
        return sendMessage(senderID, { text: `❌ No description found for /${commandName}.` });
      }
    } else {
      const commandList = Object.keys(commands).map(cmd => `┃➠ /${cmd}`).join('\n');
      const helpMessage = `╭─〘 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦 〙─❍\n${commandList}\n╰───〘${commandCount} 〙───❍`;
      return sendMessage(senderID, { text: helpMessage });
    }
  }

  if (message.startsWith('/')) {
    const [cmd, ...args] = message.slice(1).split(' ');
    return handleCommand(cmd, args, senderID, event);
  } else {
    const botResponse = await chatGpt4o(message, senderID);
    return sendMessage(senderID, { text: botResponse });
  }
};

const handleImage = async (event) => {
  const senderID = event.sender.id;
  const attachments = event.message.attachments;

  if (attachments && attachments[0].type === "image") {
    const imageUrl = attachments[0].payload.url;
    pendingImageDescriptions[senderID] = imageUrl; // Save image URL to wait for the prompt
    await sendMessage(senderID, { text: "📷 Image received! Now send a text to describe it." });
  }
};

const handleEvent = async (event) => {
  if (event.message) {
    if (event.message.text) {
      await handleMessage(event);
    } else if (event.message.attachments && event.message.attachments[0].type === "image") {
      await handleImage(event);
    }
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

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.listen(PORT, () => {
  console.log(`Messenger bot is starting. 🤖 🇲🇬`);
});
