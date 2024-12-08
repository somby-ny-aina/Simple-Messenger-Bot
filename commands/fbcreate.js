const axios = require('axios');
const crypto = require('crypto');

const firstNames = ['Andry', 'Tiana', 'Lova', 'Niry', 'Miora'];
const lastNames = ['Ranaivoson', 'Rakotoarisoa', 'Raharimampianina', 'Ravelo', 'Razafindrakoto'];

function generateRandomString(length) {
    return Math.random().toString(36).substring(2, 2 + length);
}

module.exports = {
  description: "Register a new Facebook account using generated details.",
  async execute(args, senderId, sendMessage) {
    try {
        const emailResponse = await axios.get('https://t-mail.vercel.app/api/generate_email');
        const email = emailResponse.data.email;

        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        
        const password = generateRandomString(12); // Random password
        const birthday = new Date('1999-05-01');
        
        const apiKey = '882a8490361da98702bf97a021ddc14d';
        const secret = '62f8ce9f74b12f84c123cc23437a4a32';
        const gender = Math.random() > 0.5 ? 'M' : 'F';

        const req = {
            api_key: apiKey,
            attempt_login: true,
            birthday: birthday.toISOString().split('T')[0], // Format the date as YYYY-MM-DD
            client_country_code: 'EN',
            fb_api_caller_class: 'com.facebook.registration.protocol.RegisterAccountMethod',
            fb_api_req_friendly_name: 'registerAccount',
            firstname: firstName,
            format: 'json',
            gender: gender,
            lastname: lastName,
            email: email,
            locale: 'en_US',
            method: 'user.register',
            password: password,
            reg_instance: generateRandomString(32),
            return_multiple_errors: true
        };

        const sortedReq = Object.entries(req).sort((a, b) => a[0].localeCompare(b[0]));
        const sig = sortedReq.map(([k, v]) => `${k}=${v}`).join('');
        const ensig = crypto.createHash('md5').update(sig + secret).digest('hex');
        req.sig = ensig;

        const apiUrl = 'https://b-api.facebook.com/method/user.register';

        const { data } = await axios.post(apiUrl, new URLSearchParams(req));

        if (data && data.new_user_id && data.session_info && data.session_info.access_token) {
            const resultMessage = `
-----------GENERATED-----------
EMAIL : ${email}
ID : ${data.new_user_id}
PASSWORD : ${password}
NAME : ${firstName} ${lastName}
BIRTHDAY : ${birthday.toISOString().split('T')[0]}
GENDER : ${gender}
-----------GENERATED-----------
Token : ${data.session_info.access_token}
-----------GENERATED-----------`;

            console.log(resultMessage);
            await sendMessage(senderId, { text: resultMessage });
        } else {
            throw new Error('Failed to register the account');
        }
    } catch (error) {
        console.error('Error:', error.message);
        await sendMessage(senderId, { text: `❌ Error registering Facebook account: ${error.message}` });
    }
  }
};
