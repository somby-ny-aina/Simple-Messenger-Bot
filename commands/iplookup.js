const axios = require("axios");

module.exports = {
  execute: async (ipAddress, senderId, sendMessage) => {
    if (!ipAddress) return sendMessage(senderId, { text: "❌ Please provide an IP address after /iplookup." });

    try {
      const response = await axios.get(`https://myapi-2f5b.onrender.com/iplookup/${ipAddress}`);

      const data = response.data;

      if (data && data.ip) {
        const { ip, continent_name, country_name, city, state_prov, country_emoji, latitude, longitude, isp, timezone, currency, country_flag } = data;

        const mapImageUrl = `https://static-maps.yandex.ru/1.x/?lang=en-US&ll=${longitude},${latitude}&size=600,400&z=12&l=map&pt=${longitude},${latitude},comma`;

        const message = `
          🌍 IP LOOKUP RESULTS🌍
          ➤ IP Address: ${ip}
          ➤ Continent: ${continent_name}
          ➤ Country: ${country_name} ${country_emoji}
          ➤ City: ${city}
          ➤ State/Province: ${state_prov}
          ➤ ISP: ${isp}
          ➤ Timezone: ${timezone.name}
          ➤ Currency: ${currency.name} (${currency.symbol})

          📍 Location on Map:
        `;

        await sendMessage(senderId, { text: message });

        await sendMessage(senderId, {
          attachment: {
            type: "image",
            payload: { url: country_flag, is_reusable: true }
          }
        });

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
      await sendMessage(senderId, { text: "❌ Error performing IP lookup." });
    }
  }
};