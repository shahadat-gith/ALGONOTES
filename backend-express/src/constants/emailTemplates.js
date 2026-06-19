const baseEmailTemplate = (title, body) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
      </head>
      <body style="font-family: sans-serif; padding: 20px; color: #333333; background-color: #ffffff;">
        <h2>ALGONOTES - ${title}</h2>
        <hr style="border: none; border-top: 1px solid #eeeeee; margin-bottom: 20px;" />
        <div>
          ${body}
        </div>
        <hr style="border: none; border-top: 1px solid #eeeeee; margin-top: 30px;" />
        <p style="font-size: 11px; color: #777777;">
          This email was automatically sent by ALGONOTES. If you didn't request this action, you can safely ignore this message.
        </p>
      </body>
    </html>
  `.trim();
};

export const welcomeEmailTemplate = (verificationUrl) => {
  const body = `
    <p>Welcome to ALGONOTES!</p>
    <p>Please click the link below to verify your email address and get started:</p>
    <p><a href="${verificationUrl}" target="_blank" style="color: #0066cc; font-weight: bold;">Verify Account</a></p>
    <p style="font-size: 12px; color: #555555;">Or copy and paste this link into your browser:<br/>${verificationUrl}</p>
  `.trim();

  return baseEmailTemplate("Confirm Your Registration", body);
};

export const otpEmailTemplate = (otp, title, purpose) => {
  const body = `
    <p>${purpose}</p>
    <p style="font-size: 14px; margin-bottom: 5px;">Your Verification Code:</p>
    <p style="font-family: monospace; font-size: 24px; font-weight: bold; letter-spacing: 2px; margin: 0; padding: 10px; background-color: #f5f5f5; display: inline-block;">
      ${otp}
    </p>
    <p style="font-size: 11px; color: #777777; margin-top: 15px;">
      This verification code is valid for 10 minutes. For security reasons, please do not share this code with anyone else.
    </p>
  `.trim();

  return baseEmailTemplate(title, body);
};