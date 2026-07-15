const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: process.env.SMTP_SERVICE,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent: ${info.response}`);
    return info;
  } catch (error) {
    console.error(`❌ Error sending email: ${error.message}`);
    throw error;
  }
};

module.exports = { transporter, sendEmail };
