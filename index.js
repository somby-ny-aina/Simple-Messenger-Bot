// By Somby Ny Aina 🇲🇬

const express = require('express');
const bodyParser = require('body-parser');
const axios = require("axios");
const app = express();
const PORT = process.env.PORT || 3000;
const PAGE_ACCESS_TOKEN = process.env.token;

const sendMessage = async (senderId, message, pageAccessToken) => {
  const MAX_LENGTH = 2000;

  const splitMessage = (text) => {
    const messageParts = [];
    for (let i = 0; i < text.length; i += MAX_LENGTH) {
      messageParts.push(text.substring(i, i + MAX_LENGTH));
    }
    return messageParts;
  };

  try {
    if (typeof message.text === 'string' && message.text.length > MAX_LENGTH) {
      const messageParts = splitMessage(message.text);

      for (const part of messageParts) {
        await axios.post(`https://graph.facebook.com/v21.0/me/messages`, {
          recipient: { id: senderId },
          message: { text: part }
        }, {
          params: {
            access_token: pageAccessToken
          },
          headers: {
            "Content-Type": "application/json"
          }
        });
      }
    } else {
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
    }
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
      params: { prompt }
    });

    const imageU = response.data.result;
    if (imageU) {
      return sendImage(senderId, imageU, PAGE_ACCESS_TOKEN);
    } else {
      return sendMessage(senderId, { text: "❌ Image generation failed." }, PAGE_ACCESS_TOKEN);
    }
  } catch (err) {
    console.error("Image generation error:", err.response ? err.response.data : err);
    return sendMessage(senderId, { text: "❌ Image generation failed." }, PAGE_ACCESS_TOKEN);
  }
};

const describeImage = async (url, prompt, senderId) => {
  try {
    const response = await axios.get(`https://sandipbaruwal.onrender.com/gemini2`, {
      params: { prompt, url }
    });

    const description = response.data.answer || "Description failed.";
    return sendMessage(senderId, { text: description }, PAGE_ACCESS_TOKEN);
  } catch (err) {
    console.error("Image description error:", err.response ? err.response.data : err);
    return sendMessage(senderId, { text: "❌ Image description failed." }, PAGE_ACCESS_TOKEN);
  }
};

const generateBingImage = async (prompt, senderId) => {
  try {
    const response = await axios.get(`https://jerome-web.onrender.com/service/api/bing`, {
      params: { prompt: encodeURIComponent(prompt) }
    });

    const images = response.data.result;
    if (images && images.length === 4) {
      for (const imageUrl of images) {
        await sendImage(senderId, imageUrl, PAGE_ACCESS_TOKEN);
      }
    } else {
      return sendMessage(senderId, { text: "❌ Image generation failed." }, PAGE_ACCESS_TOKEN);
    }
  } catch (err) {
    console.error("Bing image generation error:", err.response ? err.response.data : err);
    return sendMessage(senderId, { text: "❌ Image generation failed." }, PAGE_ACCESS_TOKEN);
  }
};

const getAnswer = async (text, senderId, repliedTo) => {
  if (text.startsWith('/generate ')) {
    const prompt = text.substring(10).trim();
    if (!prompt) {
      return sendMessage(senderId, { text: "❌ Please provide a prompt after /generate." }, PAGE_ACCESS_TOKEN);
    }
    return generateImage(prompt, senderId);
  } else if (text.startsWith('/bing')) {
    const prompt = text.substring(5).trim();
    if (!prompt) {
      return sendMessage(senderId, { text: "❌ Please provide a prompt after /bing." }, PAGE_ACCESS_TOKEN);
    }
    return generateBingImage(prompt, senderId);
  } else if (repliedTo && repliedTo.type === 'image') {
    const imageUrl = repliedTo.url;
    return describeImage(imageUrl, text, senderId);
  } else {
    try {
      const response = await axios.get(`https://joshweb.click/api/gpt-4o`, {
        params: { q: text, uid: senderId }
      });

      let botAnswer = response.data.result;

      if (botAnswer.includes("https://files.eqing.tech")) {
        botAnswer = botAnswer.replaceAll(".", "♥️") + "\n\nPlease follow the link instructions carefully.";
      }

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
  const repliedTo = event.message.reply_to ? {
    type: event.message.reply_to.attachments[0].type,
    url: event.message.reply_to.attachments[0].payload.url
  } : null;

  if (!senderID || !message) return;

  return getAnswer(message, senderID, repliedTo);
};

const handleImage = async (event) => {
  const senderID = event.sender.id;
  const imageUrl = event.message.attachments[0].payload.url;

  if (!senderID || !imageUrl) return;

};

const handleEvent = async (event) => {
  if (event.message) {
    if (event.message.attachments && event.message.attachments[0].type === "image") {
      await handleImage(event);
    } else {
      await listenMessage(event);
    }
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
  console.log(`Messenger bot is starting. 🤖 🇲🇬`);
});
