const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

module.exports = {
  execute: async (userId, senderId, sendMessage) => {
    if (!userId) {
      return sendMessage(senderId, { text: "❌ Please provide a Facebook ID or profile link after /fbviewer." });
    }

    let uid = userId;
    if (!/^\d+$/.test(userId)) {
      const match = userId.match(/profile\.php\?id=(\d+)/);
      if (match) {
        uid = match[1];
      } else {
        return sendMessage(senderId, { text: "❌ Invalid Facebook ID or profile URL." });
      }
    }

    try {
      const userInfo = await new Promise((resolve, reject) => {
        api.getUserInfo(uid, (err, result) => {
          if (err) return reject(err);
          resolve(result[uid]);
        });
      });

      const avatarUrl = userInfo.profile_pic;
      const canvasSize = 1080;
      const canvas = createCanvas(canvasSize, canvasSize);
      const ctx = canvas.getContext('2d');

      // Background Gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvasSize);
      gradient.addColorStop(0, '#fafafa');
      gradient.addColorStop(1, '#e0e0e0');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvasSize, canvasSize);

      // Profile Picture
      const profilePic = await loadImage(avatarUrl);
      const profilePicSize = 300;
      const profilePicX = (canvasSize - profilePicSize) / 2;
      const profilePicY = 80;
      ctx.drawImage(profilePic, profilePicX, profilePicY, profilePicSize, profilePicSize);

      // User Details
      ctx.fillStyle = '#262626';
      ctx.font = 'bold 48px Helvetica';
      ctx.textAlign = 'center';
      ctx.fillText(userInfo.name, canvasSize / 2, profilePicY + profilePicSize + 80);

      const genderText = userInfo.gender == 1 ? "Girl" : userInfo.gender == 2 ? "Boy" : "Unknown";
      ctx.font = '24px Helvetica';
      ctx.fillText(`Gender: ${genderText}`, canvasSize / 2, profilePicY + profilePicSize + 160);

      const bioMaxWidth = canvasSize - 160;
      const bioLines = splitText(ctx, `User Type: ${userInfo.type}\nIs Friend: ${userInfo.isFriend ? "Yes" : "No"}\nIs Birthday today: ${userInfo.isBirthday ? "Yes" : "No"}`, bioMaxWidth);
      ctx.font = '18px Helvetica';
      bioLines.forEach((line, index) => {
        ctx.fillText(line, canvasSize / 2, profilePicY + profilePicSize + 200 + index * 25);
      });

      // Save and Send Image
      const outputPath = path.join(__dirname, 'cache', `${uid}-fbviewer.png`);
      const out = fs.createWriteStream(outputPath);
      const stream = canvas.createPNGStream();
      stream.pipe(out);
      out.on('finish', () => {
        console.log('Facebook profile image created successfully!');
        sendMessage(senderId, { 
          attachment: fs.createReadStream(outputPath)
        }, () => fs.unlinkSync(outputPath));
      });
    } catch (err) {
      console.error('Error in fbviewer command', err);
      sendMessage(senderId, { text: "❌ Error fetching the profile details." });
    }
  }
};

// Helper function to wrap text within a maximum width
function splitText(ctx, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  for (const word of words) {
    const width = ctx.measureText(`${currentLine} ${word}`).width;
    if (width > maxWidth && currentLine.length > 0) {
      lines.push(currentLine.trim());
      currentLine = word;
    } else {
      currentLine += ` ${word}`;
    }
  }

  if (currentLine) lines.push(currentLine.trim());
  return lines;
}