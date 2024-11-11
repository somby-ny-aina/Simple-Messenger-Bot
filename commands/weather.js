const axios = require("axios");

module.exports = {
  execute: async (location, senderId, sendMessage) => {
    if (!location) {
      return sendMessage(senderId, { text: "❌ Please provide a location after /weather." });
    }

    try {
      const response = await axios.get(`https://jerome-web.onrender.com/service/api/weather`, {
        params: { q: location }
      });

      const data = response.data;

      if (data.cod === 200) {
        const weatherInfo = data.weather[0];
        const mainInfo = data.main;
        const windInfo = data.wind;
        const sysInfo = data.sys;

        const weatherMessage = `
Weather in ${data.name}, ${sysInfo.country}:

- 𝗖𝗼𝗻𝗱𝗶𝘁𝗶𝗼𝗻: ${weatherInfo.description}
- 𝗧𝗲𝗺𝗽𝗲𝗿𝗮𝘁𝘂𝗿𝗲: ${mainInfo.temp}°C (Feels like ${mainInfo.feels_like}°C)
- 𝗛𝘂𝗺𝗶𝗱𝗶𝘁𝘆: ${mainInfo.humidity}%
- 𝗣𝗿𝗲𝘀𝘀𝘂𝗿𝗲: ${mainInfo.pressure} hPa
- 𝗪𝗶𝗻𝗳: ${windInfo.speed} m/s, Gusts: ${windInfo.gust} m/s
- 𝗩𝗶𝘀𝗶𝗯𝗶𝗹𝗶𝘁𝘆: ${data.visibility} meters
- 𝗦𝘂𝗻𝗿𝗶𝘀𝗲: ${new Date(sysInfo.sunrise * 1000).toLocaleTimeString()}
- 𝗦𝘂𝗻𝘀𝗲𝘁: ${new Date(sysInfo.sunset * 1000).toLocaleTimeString()}
        `;

        await sendMessage(senderId, { text: weatherMessage });
      } else {
        sendMessage(senderId, { text: `❌ Could not retrieve weather data for "${location}".` });
      }
    } catch (error) {
      console.error("Error fetching weather data:", error.message);
      sendMessage(senderId, { text: "❌ Error fetching weather data." });
    }
  }
};
