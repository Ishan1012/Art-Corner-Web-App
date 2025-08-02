const nodemailer = require('nodemailer');
const { Message } = require('./Message');

const sendVerificationEmail = async (to, verificationLink) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Verify Your Email',
    html: Message(verificationLink, process.env.HERO_IMG)
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendVerificationEmail;
