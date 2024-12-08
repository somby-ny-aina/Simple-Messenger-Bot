const axios = require('axios');
const crypto = require('crypto');

// List of Malagasy first names and last names
const firstNames = ['Andry', 'Tiana', 'Lova', 'Niry', 'Miora'];
const lastNames = ['Ranaivoson', 'Rakotoarisoa', 'Raharimampianina', 'Ravelo', 'Razafindrakoto'];

function generateRandomString(length) {
    return Math.random().toString(36).substring(2, 2 + length);
}

// Function to generate random password
function generateRandomPassword(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters[randomIndex];
    }
    return password;
}

// Function to generate random birthday
function generateRandomBirthday() {
    const start = new Date(1990, 0, 1); // January 1, 1990
    const end = new Date(2005, 11, 31); // December 31, 2005
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

module.exports = {
  description: "Register a new Facebook account using generated details.",
  async execute(args, senderId, sendMessage) {
    try {
        const emailResponse = await axios.get('https://t-mail.vercel.app/api/generate_email');
        const email = emailResponse.data.email;

        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

        const password = generateRandomPassword(12); // Generate random password
        const birthday = generateRandomBirthday(); // Generate random birthday

        const apiKey = '882a8490361da98702bf97a021ddc14d';
        const secret = '62f8ce9f74b12f84c123cc23437a4a32';
        const gender = Math.random() > 0.5 ? 'M' : 'F'; // Randomly choose gender

        const req = {
            api_key: apiKey,
            attempt_login: true,
            birthday: birthday.toISOString().split('T')[0], // Format birthday as YYYY-MM-DD
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

        console.log("Request data:", req); // Add logging to check request parameters

        const apiUrl = 'https://b-api.facebook.com/method/user.register';

        const { data } = await axios.post(apiUrl, new URLSearchParams(req));

        console.log("Response data:", data); // Log the response from Facebook API

        if (data && data.new_user_id && data.session_info && data.session_info.access_token) {
            const resultMessage = `✅ Facebook account created successfully! \nUser ID: ${data.new_user_id} \nAccess Token: ${data.session_info.access_token}\n\nEmail: ${email}\nPassword: ${password}`;
            console.log(resultMessage);
            await sendMessage(senderId, { text: resultMessage });
        } else {
            throw new Error('Failed to register the account. Response: ' + JSON.stringify(data));
        }
    } catch (error) {
        console.error('Error:', error.message);
        await sendMessage(senderId, { text: `❌ Error registering Facebook account: ${error.message}` });
    }
  }
};
