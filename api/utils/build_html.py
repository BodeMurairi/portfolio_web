#!/usr/bin/env python3


def build_html(name: str, email: str, subject: str, message: str) -> str:
    return f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Portfolio Contact</title>
    </head>
    <body style="margin:0;padding:0;background-color:#f1f5f9;font-family:Arial,sans-serif;">

      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9;padding:40px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">

              <!-- Header -->
              <tr>
                <td style="background-color:#1E3A8A;padding:32px 40px;text-align:center;">
                  <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">
                    Portfolio Contact
                  </h1>
                  <p style="margin:6px 0 0;color:#93c5fd;font-size:13px;">New message from your portfolio website</p>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:36px 40px;">

                  <!-- Sender info -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;background-color:#f8fafc;border-radius:8px;padding:20px;border-left:4px solid #1E3A8A;">
                    <tr>
                      <td>
                        <p style="margin:0 0 6px;font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:1px;font-weight:600;">From</p>
                        <p style="margin:0;font-size:16px;color:#1e293b;font-weight:700;">{name}</p>
                        <p style="margin:4px 0 0;font-size:14px;color:#1E3A8A;">{email}</p>
                      </td>
                    </tr>
                  </table>

                  <!-- Subject -->
                  <p style="margin:0 0 6px;font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Subject</p>
                  <p style="margin:0 0 24px;font-size:16px;color:#1e293b;font-weight:600;">{subject}</p>

                  <!-- Divider -->
                  <hr style="border:none;border-top:1px solid #e2e8f0;margin-bottom:24px;" />

                  <!-- Message -->
                  <p style="margin:0 0 10px;font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Message</p>
                  <p style="margin:0;font-size:15px;color:#334155;line-height:1.8;white-space:pre-line;">{message}</p>

                </td>
              </tr>

              <!-- Reply CTA -->
              <tr>
                <td style="padding:0 40px 36px;text-align:center;">
                  <a href="mailto:{email}?subject=Re: {subject}"
                     style="display:inline-block;background-color:#1E3A8A;color:#ffffff;text-decoration:none;padding:12px 32px;border-radius:8px;font-size:14px;font-weight:600;letter-spacing:1px;text-transform:uppercase;">
                    Reply to {name}
                  </a>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color:#f8fafc;padding:20px 40px;text-align:center;border-top:1px solid #e2e8f0;">
                  <p style="margin:0;font-size:12px;color:#94a3b8;">
                    This message was sent via your portfolio contact form.
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
