// By Somby Ny Aina 🇲🇬

const express = require('express');
const bodyParser = require('body-parser');
const axios = require("axios");
const app = express();
const PORT = process.env.PORT || 3000;
const PAGE_ACCESS_TOKEN = process.env.token;

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

const sendImage = async (senderId, imageUrl, pageAccessToken) => {
  try {
    const response = await axios.post(`https://graph.facebook.com/v21.0/me/messages`, {
      recipient: { id: senderId },
      message: {
        attachment: {
          type: "image",
          payload: {
            url: imageUrl,
            is_reusable: true
          }
        }
      }
    }, {
      params: {
        access_token: pageAccessToken
      },
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (response.data.error) {
      console.error('Error sending image:', response.data.error);
      throw new Error(response.data.error.message);
    }

    return response.data;
  } catch (error) {
    console.error('Error sending image:', error.message);
    throw error;
  }
};

const generateImage = async (prompt, senderId) => {
  try {
    const response = await axios.get(`https://joshweb.click/aigen`, {
      params: {
        prompt
      }
    });

    const imageUrl = response.data.result;
    if (imageUrl) {
      return sendImage(senderId, imageUrl, PAGE_ACCESS_TOKEN);
    } else {
      return sendMessage(senderId, { text: "❌ Image generation failed." }, PAGE_ACCESS_TOKEN);
    }
  } catch (err) {
    console.error("Image generation error:", err.response ? err.response.data : err);
    return sendMessage(senderId, { text: "❌ Image generation failed." }, PAGE_ACCESS_TOKEN);
  }
};

const getAnswer = async (text, senderId) => {
  if (text.startsWith('/generate ')) {

    const prompt = text.substring(10).trim();
    if (!prompt) {
      return sendMessage(senderId, { text: "❌ Please provide a prompt after /generate." }, PAGE_ACCESS_TOKEN);
    }
    return generateImage(prompt, senderId);
  } else if (text.startsWith('/lyrics')) {
  const prompt = text.substring(10).trim();

  if (!prompt) {
    return sendMessage(senderId, { text: "Please provide a prompt after /lyrics." }, PAGE_ACCESS_TOKEN);
  }

  const response = await axios.get(`https://lyrist.vercel.app/api/${encodeURIComponent(prompt)}`);
  
  const artist = response.data.artist;
  const title = response.data.title;
  const lyrics = response.data.lyrics;
  const image = response.data.image;
  const botAnswer = `Title: ${title}\nArtist: ${artist}\n\n\nLyrics:\n${lyrics}`;

  return sendMessage(senderId, { text: botAnswer }, PAGE_ACCESS_TOKEN);
  sendImage(senderId, image, PAGE_ACCESS_TOKEN);
} else {
    try {
      const response = await axios.get(`https://joshweb.click/api/gpt-4o`, {
        params: {
          q: text,
          uid: senderId
        }
      });

      const botAnswer = response.data.result;
      return sendMessage(senderId, { text: botAnswer }, PAGE_ACCESS_TOKEN);
    } catch (err) {
      console.error("GPT-4O error:", err.response ? err.response.data : err);
      return sendMessage(senderId, { text: "❌ Replying failed." }, PAGE_ACCESS_TOKEN);
    }
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
  res.sendFile(__dirname + '/index.html');
});

app.listen(PORT, () => {
  console.log(`Messenger bot is starting. 🤖 🇲🇬 `);
});
