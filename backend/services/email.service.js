import dotenv from "dotenv"

dotenv.config()

import transporter from "../configs/nodemailer.js";

/**
 * Sends an email using the configured Nodemailer transporter.
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject line
 * @param {string} options.html - HTML email body content
 * @returns {Promise<Object>} Nodemailer info object on success
 */
const sendEmail = async ({ to, subject, html }) => {
  try {
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || "ALGONOTES"}" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

export default sendEmail;