const express = require('express');
const { Client } = require('whatsapp-web.js');

const app = express();
const port = process.env.PORT || 3000;

// json parser build in express
app.use(express.json());

// body parser build in express
app.use(express.urlencoded({ extended: true }));

// whatsapp-web.js
const client = new Client();

client.on('qr', (qr) => {
  // Generate and scan this code with your phone
  console.log('QR RECEIVED', qr);
});

client.on('ready', () => {
  console.log('Client is ready!');
});

client.on('message', (msg) => {
  if (msg.body == '!ping') {
    msg.reply('pong');
  }
});

client.initialize();

app.listen(port, () => {
  console.log(`app running at http://localhost:${port}`);
});
