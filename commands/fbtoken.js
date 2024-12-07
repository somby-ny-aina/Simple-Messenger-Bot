const axios = require('axios');

module.exports = {
  description: "Get EAAAA access token\n\n/fbtoken <email> | <password>",
  async execute(args, senderId, sendMessage) {
    if (args.length !== 1 || !args[0].includes('|')) {
      return sendMessage(senderId, { text: "❌ Please provide both email and password in the format: /fbtoken email | password" });
    }

    const [email, password] = args[0].split('|').map(item => item.trim());

    if (!email || !password) {
      return sendMessage(senderId, { text: "❌ Both email and password must be provided." });
    }

    try {
      const adid = "c562874d397341448f164ba4cb8faf8f";
      const deviceId = "c562874d-3973-4144-8f16-4ba4cb8faf8f";

      const response = await axios.post("https://b-graph.facebook.com/auth/login", null, {
        headers: {
          "Authorization": "OAuth 350685531728|62f8ce9f74b12f84c123cc23437a4a32",
          "X-Fb-Friendly-Name": "Authenticate",
          "X-Fb-Connection-Type": "Unknown",
          "Accept-Encoding": "gzip, deflate",
          "Content-Type": "application/x-www-form-urlencoded",
          "X-Fb-Http-Engine": "Liger"
        },
        params: {
          adid: adid,
          format: "json",
          device_id: deviceId,
          email: email,
          password: password,
          generate_analytics_claims: 0,
          credentials_type: "password",
          source: "login",
          error_detail_type: "button_with_disabled",
          enroll_misauth: false,
          generate_session_cookies: 0,
          generate_machine_id: 0,
          fb_api_req_friendly_name: "authenticate"
        }
      });

      await sendMessage(senderId, { text: `Access token: ${response.data.access_token}` });
    } catch (error) {
      console.error('Login error:', error.message);
      await sendMessage(senderId, { text: "❌ Login failed. Please check your credentials or try again later." });
    }
  }
};
