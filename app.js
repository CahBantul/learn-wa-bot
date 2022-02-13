const fs = require('fs');
const express = require('express');
const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fetch = require('cross-fetch');

const app = express();
const port = process.env.PORT || 3000;

// Path where the session data will be stored
const SESSION_FILE_PATH = './session.json';

// Load the session data if it has been previously saved
let sessionData;
if (fs.existsSync(SESSION_FILE_PATH)) {
  sessionData = require(SESSION_FILE_PATH);
}

// json parser build in express
app.use(express.json());

// body parser build in express
app.use(express.urlencoded({ extended: true }));

// whatsapp-web.js
const client = new Client({
  session: sessionData,
});

client.on('qr', (qr) => {
  // Generate and scan this code with your phone
  console.log('QR RECEIVED', qr);
  qrcode.generate(qr);
});

client.on('ready', () => {
  console.log('Client is ready!');
});

// Save session values to the file upon successful auth
client.on('authenticated', (session) => {
  sessionData = session;
  fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), (err) => {
    if (err) {
      console.error(err);
    }
  });
});

client.on('message', async (msg) => {
  // filter chat not from group
  if (!msg.from.includes('-')) {
    const response = await fetch(
      `https://api.simsimi.net/v2/?text=${msg.body}&lc=id`
    );
    const data = await response.json();
    msg.reply(data.success);

    console.log(data);
  }
});

client.initialize();

app.listen(port, () => {
  console.log(`app running at http://localhost:${port}`);
});
