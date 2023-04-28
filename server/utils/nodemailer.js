const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

function sendLetter(email, subject, text, options) {
  let message = {
    from: `achaika <${process.env.EMAIL_USER}>`,
    to: email,
    subject: subject,
    html: text,
    ...(options ? options : {}),
  };
  // nodemailer
  console.log({ message });
  transporter.sendMail(message, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

module.exports = { sendLetter };
