import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: process.env.MAIL_SERVER,
  port: parseInt(process.env.MAIL_PORT, 10),
  secure: false, 
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD
  }
});

export const mailOptions = {
  from: `"${process.env.MAIL_FROM_NAME || 'ALGONOTES'}" <${process.env.MAIL_FROM}>`
};