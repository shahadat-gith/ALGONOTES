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
              <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 540px; background-color: #0d1527; border-radius: 12px; overflow: hidden; border: 1px solid #1e293b; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.45);">
                
                <tr>
                  <td height="4" style="background: linear-gradient(90deg, #0f766e, #14b8a6, #2dd4bf);"></td>
                </tr>

                <tr>
                  <td style="padding: 32px 32px 20px 32px; background-color: #0d1527;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td>
                          <h1 style="margin: 0; font-size: 20px; font-weight: 800; color: #ffffff; letter-spacing: 1.5px; font-family: 'Courier New', Courier, monospace;">ALGONOTES</h1>
                          <p style="margin: 4px 0 0 0; font-size: 11px; color: #64748b; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase;">AI-Powered DSA Note Space & Engine</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 24px 32px 40px 32px;">
                    <h2 style="margin: 0 0 16px 0; color: #f8fafc; font-size: 18px; font-weight: 700; letter-spacing: -0.3px;">{title}</h2>
                    {body}
                  </td>
                </tr>

                <tr>
                  <td style="padding: 24px 32px; background-color: #070a12; border-top: 1px solid #141b2d; text-align: left;">
                    <p style="margin: 0; color: #475569; font-size: 11px; line-height: 1.6; font-family: sans-serif;">
                      This system message was dispatched automatically by ALGONOTES workspace engines. If you did not trigger this action sequence workflow, you can disregard this email safely.
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
    <p style="color: #94a3b8; font-size: 14px; line-height: 1.7; margin: 0 0 28px 0;">
      Welcome to your new developer deployment environment. Verify your email address property matrix below to fully activate your ALGONOTES instance account and start compiling clean, optimized DSA data structures.
    </p>

    <table cellpadding="0" cellspacing="0" style="margin: 20px 0;">
      <tr>
        <td style="border-radius: 6px; background-color: #14b8a6; text-align: center;">
          <a href="{verification_url}" target="_blank"
             style="display: inline-block; background-color: #14b8a6; color: #022c22; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 700; font-size: 13px; letter-spacing: 0.5px; border: 1px solid #2dd4bf;">
            Verify Instance Account
          </a>
        </td>
      </tr>
    </table>

    <p style="color: #475569; font-size: 12px; line-height: 1.6; margin: 32px 0 0 0; border-top: 1px dashed #1e293b; padding-top: 20px;">
      If the action execution button above fails to execute, pass the target source URL tracking link directly into your browser window:
    </p>

    <p style="margin: 8px 0 0 0;">
      <a href="{verification_url}" style="color: #14b8a6; font-size: 12px; word-break: break-all; font-family: monospace; text-decoration: none;">
        {verification_url}
      </a>
    </p>
    """

    return base_email_template(
        title="Initialize Your ALGONOTES Profile Space",
        body=body
    )


def otp_email_template(otp: str, title: str, purpose: str, danger: bool = False) -> str:
    brand_color = "#f43f5e" if danger else "#14b8a6"
    background_surface = "#1c1417" if danger else "#0b1919"
    border_surface = "#4c1d24" if danger else "#115e59"

    body = f"""
    <p style="color: #94a3b8; font-size: 14px; line-height: 1.7; margin: 0 0 24px 0;">
      {purpose}
    </p>

    <div style="background-color: {background_surface}; border: 1px solid {border_surface}; border-radius: 8px; padding: 24px; text-align: center; margin: 24px 0;">
      <p style="margin: 0 0 10px 0; color: #64748b; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.8px;">
        Authentication Token Verification OTP
      </p>
      <div style="font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 800; letter-spacing: 10px; color: {brand_color}; padding-left: 10px;">
        {otp}
      </div>
    </div>

    <p style="color: #64748b; font-size: 12px; line-height: 1.6; margin: 0;">
      This operational safety payload key token sequence will automatically expire from database buffers within <strong>10 minutes</strong>. Do not distribute across open channels.
    </p>
    """

    return base_email_template(
        title=title,
        body=body
    )