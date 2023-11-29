const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "c3c8c7be76f464",
    pass: "918616b57c324b",
  },
});

module.exports = transport;
