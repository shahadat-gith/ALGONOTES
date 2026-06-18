# app/constants/email_templates.py

def base_email_template(title: str, body: str) -> str:
    return f"""
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>{title}</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #090d16; font-family: 'Segoe UI', Arial, sans-serif; -webkit-font-smoothing: antialiased;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #090d16; padding: 40px 16px;">
          <tr>
            <td align="center">
              <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 540px; background-color: #0d1527; border-radius: 8px; overflow: hidden; border: 1px solid #1e293b; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);">
                
                <tr>
                  <td height="3" style="background-color: #14b8a6;"></td>
                </tr>

                <tr>
                  <td style="padding: 32px 32px 16px 32px; background-color: #0d1527;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td>
                          <h1 style="margin: 0; font-size: 18px; font-weight: 800; color: #ffffff; letter-spacing: 1px; font-family: monospace;">ALGONOTES</h1>
                          <p style="margin: 4px 0 0 0; font-size: 11px; color: #64748b; tracking-wide: 0.5px; text-transform: uppercase;">Your AI-Powered Notes Workspace</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 16px 32px 32px 32px;">
                    <h2 style="margin: 0 0 16px 0; color: #f8fafc; font-size: 16px; font-weight: 700;">{title}</h2>
                    {body}
                  </td>
                </tr>

                <tr>
                  <td style="padding: 24px 32px; background-color: #070a12; border-top: 1px solid #1e293b; text-align: left;">
                    <p style="margin: 0; color: #475569; font-size: 11px; line-height: 1.5;">
                      This email was automatically sent by ALGONOTES. If you didn't request this action, you can safely ignore this message.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
    """


def welcome_email_template(verification_url: str) -> str:
    body = f"""
    <p style="color: #94a3b8; font-size: 13px; line-height: 1.6; margin: 0 0 24px 0;">
      Welcome to ALGONOTES!. Please click the button below to verify your email address and get started.
    </p>

    <table cellpadding="0" cellspacing="0" style="margin: 20px 0;">
      <tr>
        <td style="border-radius: 4px; background-color: #14b8a6; text-align: center;">
          <a href="{verification_url}" target="_blank"
             style="display: inline-block; background-color: #14b8a6; color: #0d1527; text-decoration: none; padding: 11px 20px; border-radius: 4px; font-weight: 700; font-size: 13px; letter-spacing: 0.5px;">
            Verify Account
          </a>
        </td>
      </tr>
    </table>

    <p style="color: #475569; font-size: 11px; line-height: 1.5; margin: 28px 0 0 0; border-top: 1px dashed #1e293b; padding-top: 16px;">
      If the button doesn't work, copy and paste this link into your browser:
    </p>

    <p style="margin: 6px 0 0 0;">
      <a href="{verification_url}" style="color: #14b8a6; font-size: 11px; word-break: break-all; font-family: monospace; text-decoration: none;">
        {verification_url}
      </a>
    </p>
    """

    return base_email_template(
        title="Confirm Your Registration",
        body=body
    )


def otp_email_template(otp: str, title: str, purpose: str, danger: bool = False) -> str:
    brand_color = "#f43f5e" if danger else "#14b8a6"
    background_surface = "#1a1215" if danger else "#0a1616"
    border_surface = "#3b181e" if danger else "#0f4c47"

    body = f"""
    <p style="color: #94a3b8; font-size: 13px; line-height: 1.6; margin: 0 0 20px 0;">
      {purpose}
    </p>

    <div style="background-color: {background_surface}; border: 1px solid {border_surface}; border-radius: 6px; padding: 20px; text-align: center; margin: 20px 0;">
      <p style="margin: 0 0 8px 0; color: #64748b; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
        Your Verification Code
      </p>
      <div style="font-family: monospace; font-size: 32px; font-weight: 800; letter-spacing: 6px; color: {brand_color}; padding-left: 6px;">
        {otp}
      </div>
    </div>

    <p style="color: #64748b; font-size: 11px; line-height: 1.5; margin: 0;">
      This verification code is valid for **10 minutes**. For security reasons, please do not share this code with anyone else.
    </p>
    """

    return base_email_template(
        title=title,
        body=body
    )