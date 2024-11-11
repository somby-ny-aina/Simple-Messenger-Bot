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
- Condition: ${weatherInfo.description}
- Temperature: ${mainInfo.temp}°C (Feels like ${mainInfo.feels_like}°C)
- Humidity: ${mainInfo.humidity}%
- Pressure: ${mainInfo.pressure} hPa
- Wind: ${windInfo.speed} m/s, Gusts: ${windInfo.gust} m/s
- Visibility: ${data.visibility} meters
- Sunrise: ${new Date(sysInfo.sunrise * 1000).toLocaleTimeString()}
- Sunset: ${new Date(sysInfo.sunset * 1000).toLocaleTimeString()}
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