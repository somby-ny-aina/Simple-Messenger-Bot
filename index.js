const express = require('express');
const bodyParser = require('body-parser');
const axios = require("axios");
const app = express();
const PORT = process.env.PORT || 3000;
const PAGE_ACCESS_TOKEN = process.env.token;
const prompt = "I am Smo bot";

const sendMessage = async (senderId, message, pageAccessToken) => {
  try {
    const response = await axios.post(`https://graph.facebook.com/v21.0/me/messages`, {
      recipient: { id: senderId },
      message
    }, {
      params: {
        access_token: pageAccessToken
      },
      headers: {
        "Content-Type": "application/json"
      }
    });
    
    if (response.data.error) {
      console.error('Error sending message:', response.data.error);
      throw new Error(response.data.error.message);
    }

    return response.data;
  } catch (error) {
    console.error('Error sending message:', error.message);
    throw error;
  }
};

const getAnswer = async (text, senderId) => {
  try {
    const response = await axios.get(`https://personal-ai-phi.vercel.app/kshitiz`, {
      params: {
        prompt: prompt,
        content: text
      }
    });

    const botAnswer = response.data.answer;
    
    if (typeof botAnswer !== 'string' || !isUTF8(botAnswer)) {
      console.error('Invalid UTF-8 response from AI:', botAnswer);
      return sendMessage(senderId, { text: "❌ Invalid response from the AI." }, PAGE_ACCESS_TOKEN);
    }

    return sendMessage(senderId, { text: botAnswer }, PAGE_ACCESS_TOKEN);
  } catch (err) {
    console.error("Reply:", err.response ? err.response.data : err);
    return sendMessage(senderId, { text: "❌ Replying failed." }, PAGE_ACCESS_TOKEN);
  }
};

function isUTF8(str) {
  try {
    return decodeURIComponent(escape(str)) === str;
  } catch (e) {
    return false;
  }
}

const listenMessage = async (event) => {
  const senderID = event.sender.id;
  const message = event.message.text;
  if (!senderID || !message) return;

  return getAnswer(message, senderID);
};

const handleEvent = async (event) => {
  if (event.message) {
    await listenMessage(event);
  }
};

app.use(bodyParser.json());

app.get('/webhook', (req, res) => {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "somby";
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('Webhook verified!');
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

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
  console.log(`Messenger bot is starting. 🤖 🇲🇬 `);
});
