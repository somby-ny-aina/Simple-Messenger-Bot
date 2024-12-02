const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cookie = require('cookie');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/share', async (req, res) => {
    const { cookie, targetUrl, userId, postId } = req.body;

    try {
        const response = await axios.get(targetUrl, {
            headers: {
                'cookie': cookie,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            }
        });

        const $ = cheerio.load(response.data);

        const shareActionProperties = $('input[name="share_action_properties"]').val();
        const composerSessionId = $('input[name="composer_session_id"]').val();
        const fbDtsg = $('input[name="fb_dtsg"]').val();
        const jazoest = $('input[name="jazoest"]').val();
        const privacy = $('input[name="privacy"]').val();

        const shareData = {
            fb_dtsg: fbDtsg,
            jazoest: jazoest,
            from_post: '1',
            app_id: '966242223397117',
            redirect_uri: 'https://mbasic.facebook.com/dialog/close_window/?app_id=966242223397117&connect=0',
            privacy: privacy,
            share_action_properties: shareActionProperties,
            composer_session_id: composerSessionId
        };

        await axios.post('https://mbasic.facebook.com/v2.3/dialog/share/submit', shareData, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        res.send('Post shared successfully!');
    } catch (error) {
        res.status(500).send('Error while sharing post');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
