// utils/sendWhatsAppMessage.js
const twilio = require('twilio');

const accountSid = process.env.SID;     // Replace with your Twilio SID
const authToken = process.env.Ttoken;       // Replace with your Twilio Auth Token
const client = twilio(accountSid, authToken);

const sendWhatsAppMessage = async (to, message) => {
  try {
    const response = await client.messages.create({
      from: 'whatsapp:+14155238886', // Twilio sandbox sender
      to: `whatsapp:${+916202609186}`,          // Customer's phone number
      body: message,
    });
    console.log(`Message sent to ${to}: SID ${response.sid}`);
  } catch (error) {
    console.error(`Failed to send WhatsApp to ${to}:`, error.message);
  }
};

module.exports = sendWhatsAppMessage;


// utils/sendWhatsAppWebMessage.js
// const { Client, LocalAuth } = require('whatsapp-web.js');
// const qrcode = require('qrcode-terminal');

// let client;

// const initClient = () => {
//   client = new Client({
//     authStrategy: new LocalAuth(),
//     puppeteer: {
//       headless: true,
//       args: ['--no-sandbox'],
//     },
//   });

//   client.on('qr', qr => {
//     console.log('Scan this QR code:');
//     qrcode.generate(qr, { small: true });
//   });

//   client.on('ready', () => {
//     console.log('WhatsApp Web client is ready!');
//   });

//   client.on('auth_failure', msg => {
//     console.error('AUTHENTICATION FAILURE', msg);
//   });

//   client.initialize();
// };

// const sendWhatsAppWebMessage = async (to, message) => {
//   if (!client) {
//     console.log("Initializing WhatsApp client...");
//     initClient();
//     // Wait until client is ready before sending
//     await new Promise(resolve => {
//       client.on('ready', resolve);
//     });
//   }

//   try {
//     const number = to.startsWith('+') ? to : `+91${to}`;
//     const chatId = `${number.replace('+', '')}@c.us`;
//     await client.sendMessage(chatId, message);
//     console.log(`Sent WhatsApp message to ${number}`);
//   } catch (error) {
//     console.error(`Failed to send WhatsApp message to ${to}:`, error.message);
//   }
// };

// module.exports = { sendWhatsAppWebMessage, initClient };
