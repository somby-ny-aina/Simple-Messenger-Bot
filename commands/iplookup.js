const axios = require("axios");

module.exports = {
  execute: async (ipAddress, senderId, sendMessage) => {
    if (!ipAddress) {
      return sendMessage(senderId, { text: "❌ Please provide an IP address after /iplookup." });
    }

    try {
      const response = await axios.get(`https://myapi-2f5b.onrender.com/iplookup/${ipAddress}`);
      
      if (!response.data) {
        return sendMessage(senderId, { text: "❌ No data returned from the API." });
      }

      const data = response.data;

      if (data && data.ip) {
        const { ip, continent_name, country_name, city, state_prov, country_emoji, latitude, longitude, isp, timezone, currency, country_flag } = data;

        if (!latitude || !longitude) {
          return sendMessage(senderId, { text: "❌ Unable to generate map due to missing location data." });
        }

        const mapImageUrl = `https://static-maps.yandex.ru/1.x/?lang=en-US&ll=${longitude},${latitude}&size=600,400&z=12&l=map&pt=${longitude},${latitude},comma`;

        const timezoneName = timezone ? timezone.name : "Unknown";
        const currencyName = currency ? currency.name : "Unknown";
        const currencySymbol = currency ? currency.symbol : "";

        const message = `
          🌍 **IP LOOKUP RESULTS** 🌍
          ➤ IP Address: ${ip}
          ➤ Continent: ${continent_name}
          ➤ Country: ${country_name} ${country_emoji}
          ➤ City: ${city}
          ➤ State/Province: ${state_prov}
          ➤ ISP: ${isp}
          ➤ Timezone: ${timezoneName}
          ➤ Currency: ${currencyName} (${currencySymbol})
          ➤ Longitude: ${longitude}
          ➤ Latitude: ${latitude}
        `;

        await sendMessage(senderId, { text: message });

        if (country_flag) {
          await sendMessage(senderId, {
            attachment: {
              type: "image",
              payload: { url: country_flag, is_reusable: true }
            }
          });
        }

        // Send the map image
        await sendMessage(senderId, {
          attachment: {
            type: "image",
            payload: { url: mapImageUrl, is_reusable: true }
          }
        });

      } else {
        await sendMessage(senderId, { text: "❌ No data found for this IP." });
      }
    } catch (error) {
      console.error("IP Lookup error:", error.message);
      await sendMessage(senderId, { text: "❌ Error performing IP lookup. Please try again later." });
    }
  }
};
