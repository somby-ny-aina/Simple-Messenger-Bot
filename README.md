# You need to:
<li>Create facebook page</li>
<li>Create app and get access token at <a href="https://developers.facebook.com">Facebook Developers website</a></li>
<li>Config webhook and add subscriptions: messages, messaging_optins, messaging_postbacks</li>
<li>Make live your facebook app.</li>
<li>Add your access token by environment variable configuration ( like on render )</li>
<tt>key: "token"</tt><br>
<tt>value: "your access token"</tt>

# Installation:
<code>npm init -y && npm install express body-parser axios</code>

# Run your bot:
<code>node index.js</code>

# Webhook verification:
<tt>Endpoint: /webhook</tt><br>
<tt>Verify token: somby</tt>
<hr><br><br>
<b>📌 You can change the api. Thanks to Kshitiz 😇 for the api</b><br><br>
<i>&copy; Somby Ny Aina</i>
