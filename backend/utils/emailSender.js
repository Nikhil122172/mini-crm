const nodemailer = require('nodemailer');

// Configure your email service credentials here
const transporter = nodemailer.createTransport({
  service: 'gmail', // you can use any SMTP service
  auth: {
    user: process.env.EMAIL,        // your email address
    pass: process.env.APPPASSWORD   // app password or email password
  },
});

async function sendEmail(to, subject, text) {
  const mailOptions = {
    from: 'nikhil20092003@gmail.com',
    to,
    subject,
    text,
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

module.exports = sendEmail;
