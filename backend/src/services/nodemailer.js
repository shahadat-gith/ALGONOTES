import { transporter, mailOptions } from '../config/nodemailer.js';

export const sendEmail = async (emailTo, subject, bodyHtml) => {
  await transporter.sendMail({
    from: mailOptions.from,
    to: emailTo,
    subject: subject,
    html: bodyHtml
  });
};