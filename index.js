// Simple Messenger Bot by Somby Ny Aina

const express = require('express');
const bodyParser = require('body-parser');
const axios = require("axios");
const app = express();
const PORT = process.env.PORT || 3000;
const PAGE_ACCESS_TOKEN = process.env.token;
const prompt = "You are Simon Peter.";

const sendMessage = async (senderId, message) => {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v11.0/me/messages`,
      {
        recipient: { id: senderId },
        message: typeof message === "string" ? { text: message } : message, // Ensure message is either text or an object
      },
      {
        params: { access_token: PAGE_ACCESS_TOKEN },
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (err) {
    console.error('Error sending message:', err.response ? err.response.data : err);
    throw err;
  }
};

const getAnswer = async (text, senderId) => {
  try {
    const response = await axios.get(
      `https://personal-ai-phi.vercel.app/kshitiz`,
      {
        params: {
          prompt: prompt,
          content: text
        }
      }
    );

    const botAnswer = response.data;
    return sendMessage(senderId, botAnswer);  // Send the answer back to the user

  } catch (err) {
    console.error("Reply:", err.response ? err.response.data : err);
    return "❌ Replying failed.";
  }
};

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
  res.sendFile(__dirname + '/index.html'); // Serve the index.html file
});

app.listen(PORT, () => {
  console.log(`Messenger bot is starting. 🤖 🇲🇬 `);
});
