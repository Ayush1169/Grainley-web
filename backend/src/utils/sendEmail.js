const nodemailer = require("nodemailer");

const sendEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    family: 4, // force IPv4 — Railway containers often lack outbound IPv6 routing
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "OTP Verification",
    html: `
      <h2>Your OTP</h2>
      <h1>${otp}</h1>
    `,
  });

  console.log("Email Sent");
};

module.exports = sendEmail;