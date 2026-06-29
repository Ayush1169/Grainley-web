const https = require("https");

const sendEmail = async (to, otp) => {
  const data = JSON.stringify({
    sender: {
      name: "Grainley Foods",
      email: process.env.EMAIL_USER,
    },
    to: [{ email: to }],
    subject: "OTP Verification",
    htmlContent: `
      <h2>Grainley Foods</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>This OTP is valid for 5 minutes.</p>
    `,
  });

  return new Promise((resolve, reject) => {
    const options = {
      hostname: "api.brevo.com",
      path: "/v3/smtp/email",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY,
        "Content-Length": Buffer.byteLength(data),
      },
    };

    const req = https.request(options, (res) => {
      let body = "";

      res.on("data", (chunk) => {
        body += chunk;
      });

      res.on("end", () => {
        console.log("Brevo Response:", res.statusCode, body);
        
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log("OTP Sent");
          resolve(body);
        } else {
          reject(new Error(body));
        }
      });
    });

    req.on("error", reject);

    req.write(data);
    req.end();
  });
};

module.exports = sendEmail;