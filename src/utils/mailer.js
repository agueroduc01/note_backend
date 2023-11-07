import nodemailer from "nodemailer";
import * as dotenv from "dotenv";
dotenv.config();

const hostEmail = process.env.hostEmail;
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.hostEmail,
    pass: process.env.hostPassword,
  },
});

module.exports = { transporter, hostEmail };
