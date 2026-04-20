#!/usr/bin/env python3

import os
import smtplib
import ssl
from email.message import EmailMessage
from dotenv import load_dotenv
from utils.build_html import build_html

load_dotenv()

SENDER_EMAIL = os.getenv("SENDER_EMAIL")
SENDER_PASSWORD = os.getenv("SENDER_PASSWORD")

if not all([SENDER_EMAIL, SENDER_PASSWORD]):
    raise ValueError("EMAIL credential keys missing from .env")


def send_email(name: str, email: str, subject: str, message: str):
    """Send a contact form email to the portfolio owner."""
    msg = EmailMessage()
    msg["Subject"] = f"Portfolio Contact: {subject}"
    msg["From"] = SENDER_EMAIL
    msg["To"] = SENDER_EMAIL
    msg["Reply-To"] = email

    msg.set_content(f"From: {name} <{email}>\nSubject: {subject}\n\n{message}")
    msg.add_alternative(build_html(name, email, subject, message), subtype="html")

    try:
        context = ssl.create_default_context()
        with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as smtp:
            smtp.login(user=SENDER_EMAIL, password=SENDER_PASSWORD)
            smtp.send_message(msg)
            return {"message": "Email sent successfully"}
    except Exception as e:
        raise Exception(f"Failed to send email: {e}")


def send_reply(to_email: str, reply_text: str, to_name: str = ""):
    """Send a reply email directly to the message sender."""
    msg = EmailMessage()
    msg["Subject"] = "Re: Your message"
    msg["From"] = SENDER_EMAIL
    msg["To"] = to_email

    msg.set_content(reply_text)
    msg.add_alternative(build_reply_html(reply_text), subtype="html")

    try:
        context = ssl.create_default_context()
        with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as smtp:
            smtp.login(user=SENDER_EMAIL, password=SENDER_PASSWORD)
            smtp.send_message(msg)
            return {"message": "Reply sent successfully"}
    except Exception as e:
        raise Exception(f"Failed to send reply: {e}")


def send_otp_email(to_email: str, otp_code: str):
    """Send a password reset OTP to the admin."""
    msg = EmailMessage()
    msg["Subject"] = "Your password reset code"
    msg["From"] = SENDER_EMAIL
    msg["To"] = to_email

    msg.set_content(f"Your OTP code is: {otp_code}\n\nThis code expires in 15 minutes.")
    msg.add_alternative(_build_otp_html(otp_code), subtype="html")

    try:
        context = ssl.create_default_context()
        with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as smtp:
            smtp.login(user=SENDER_EMAIL, password=SENDER_PASSWORD)
            smtp.send_message(msg)
            return {"message": "OTP sent"}
    except Exception as e:
        raise Exception(f"Failed to send OTP: {e}")


def _build_otp_html(otp_code: str) -> str:
    return f"""
    <!DOCTYPE html>
    <html lang="en">
    <head><meta charset="UTF-8"/></head>
    <body style="margin:0;padding:0;background-color:#f1f5f9;font-family:Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9;padding:40px 0;">
        <tr><td align="center">
          <table width="480" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
            <tr>
              <td style="background-color:#1E3A8A;padding:32px 40px;text-align:center;">
                <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Password Reset</h1>
                <p style="margin:6px 0 0;color:#93c5fd;font-size:13px;">Use the code below to reset your password</p>
              </td>
            </tr>
            <tr>
              <td style="padding:40px;text-align:center;">
                <p style="margin:0 0 24px;font-size:14px;color:#64748b;">Your one-time password (OTP) is:</p>
                <div style="display:inline-block;background-color:#EFF6FF;border:2px dashed #1E3A8A;border-radius:12px;padding:20px 40px;">
                  <p style="margin:0;font-size:40px;font-weight:700;letter-spacing:10px;color:#1E3A8A;">{otp_code}</p>
                </div>
                <p style="margin:24px 0 0;font-size:13px;color:#94a3b8;">This code expires in <strong>15 minutes</strong>.<br/>If you did not request this, ignore this email.</p>
              </td>
            </tr>
            <tr>
              <td style="background-color:#f8fafc;padding:20px 40px;text-align:center;border-top:1px solid #e2e8f0;">
                <p style="margin:0;font-size:12px;color:#94a3b8;">Sent from your portfolio admin panel.</p>
              </td>
            </tr>
          </table>
        </td></tr>
      </table>
    </body>
    </html>
    """


def build_reply_html(reply_text: str) -> str:
    return f"""
    <!DOCTYPE html>
    <html lang="en">
    <head><meta charset="UTF-8"/></head>
    <body style="margin:0;padding:0;background-color:#f1f5f9;font-family:Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9;padding:40px 0;">
        <tr><td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
            <tr>
              <td style="background-color:#1E3A8A;padding:32px 40px;text-align:center;">
                <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Reply</h1>
                <p style="margin:6px 0 0;color:#93c5fd;font-size:13px;">A response to your message</p>
              </td>
            </tr>
            <tr>
              <td style="padding:36px 40px;">
                <p style="margin:0;font-size:15px;color:#334155;line-height:1.8;white-space:pre-line;">{reply_text}</p>
              </td>
            </tr>
            <tr>
              <td style="background-color:#f8fafc;padding:20px 40px;text-align:center;border-top:1px solid #e2e8f0;">
                <p style="margin:0;font-size:12px;color:#94a3b8;">Sent from the portfolio admin panel.</p>
              </td>
            </tr>
          </table>
        </td></tr>
      </table>
    </body>
    </html>
    """
