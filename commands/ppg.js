const axios = require('axios');

module.exports = {
  description: "Enable or disable Facebook profile picture guard.\n/ppg <access_token> | true/false",
  async execute(args, senderId, sendMessage) {
    try {
        const [accessToken, shieldState] = args.split(' ');
        if (!accessToken || (shieldState !== 'true' && shieldState !== 'false')) {
            throw new Error("Invalid command usage. Format: /ppg <access_token> | true/false");
        }

        const enableShield = shieldState === 'true';

        const userRes = await axios.get(`https://graph.facebook.com/me?access_token=${accessToken}`);
        const userId = userRes.data.id;

        const data = new URLSearchParams({
            variables: JSON.stringify({
                "0": {
                    is_shielded: enableShield,
                    session_id: "9b78191c-84fd-4ab6-b0aa-19b39f04a6bc",
                    actor_id: userId,
                    client_mutation_id: "b0316dd6-3fd6-4beb-aed4-bb29c5dc64b0"
                }
            }),
            method: "post",
            doc_id: "1477043292367183",
            query_name: "IsShieldedSetMutation",
            strip_defaults: "true",
            strip_nulls: "true",
            locale: "en_US",
            client_country_code: "US",
            fb_api_req_friendly_name: "IsShieldedSetMutation",
            fb_api_caller_class: "IsShieldedSetMutation"
        });

        const shieldHeaders = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `OAuth ${accessToken}`
        };

        const apiUrl = "https://graph.facebook.com/graphql";
        const shieldRes = await axios.post(apiUrl, data.toString(), { headers: shieldHeaders });

        if (shieldRes.data.errors) {
            throw new Error(shieldRes.data.errors[0].message || "Failed to toggle shield.");
        }

        const resultMessage = `✅ Profile picture guard ${enableShield ? 'enabled' : 'disabled'} successfully!`;
        console.log(resultMessage);
        await sendMessage(senderId, { text: resultMessage });
    } catch (error) {
        console.error('Error:', error.message);
        await sendMessage(senderId, { text: `❌ Error toggling profile picture guard: ${error.message}` });
    }
  }
};