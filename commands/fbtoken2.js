const axios = require('axios');
const querystring = require('querystring');

module.exports = {
  description: "/fbtoken <username>|<password>",
  
  execute: async (args, senderId, sendMessage) => {
    const [username, password] = args.split('|');

    if (!username || !password) {
      return sendMessage(senderId, "❌ Username and password are required. Usage: `fbtoken <username>|<password>`");
    }

    const form = {
      adid: 'e3a395f9-84b6-44f6-a0ce-fe83e934fd4d',
      email: username.trim(),
      password: password.trim(),
      format: 'json',
      device_id: '67f431b8-640b-4f73-a077-acc5d3125b21',
      cpl: 'true',
      family_device_id: '67f431b8-640b-4f73-a077-acc5d3125b21',
      locale: 'en_US',
      client_country_code: 'US',
      credentials_type: 'device_based_login_password',
      generate_session_cookies: '1',
      generate_analytics_claim: '1',
      generate_machine_id: '1',
      currently_logged_in_userid: '0',
      irisSeqID: 1,
      try_num: '1',
      enroll_misauth: 'false',
      meta_inf_fbmeta: 'NO_FILE',
      source: 'login',
      machine_id: 'KBz5fEj0GAvVAhtufg3nMDYG',
      fb_api_req_friendly_name: 'authenticate',
      fb_api_caller_class: 'com.facebook.account.login.protocol.Fb4aAuthHandler',
      api_key: '882a8490361da98702bf97a021ddc14d',
      access_token: '350685531728%7C62f8ce9f74b12f84c123cc23437a4a32'
    };

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'x-fb-friendly-name': form.fb_api_req_friendly_name,
      'x-fb-http-engine': 'Liger',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
    };

    const url = 'https://b-graph.facebook.com/auth/login';

    try {
      const response = await axios.post(url, querystring.stringify(form), { headers });
      const responseData = response.data;
      sendMessage(senderId, `${responseData}`);
      } else {
        sendMessage(senderId, "❌ Access token not found in the response.");
      }
    } catch (error) {
      const errorDetails = error.response ? error.response.data : error.message;
      sendMessage(senderId, `❌ Error: ${errorDetails}`);
    }
  }
};