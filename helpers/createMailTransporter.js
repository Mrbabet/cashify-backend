const nodemailer = require("nodemailer");
require("dotenv").config;

const createMailTransporter = () => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });
  return transporter;
};

module.exports = { createMailTransporter };
