"use server";

import { NextResponse } from "next/server";
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
import { rateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";
import { tempEmailDomains } from "@/constants";

if (!process.env.MAILER_SEND_API_KEY) {
  throw new Error(
    "MAILER_SEND_API_KEY is not defined in environment variables",
  );
}

const mailerSend = new MailerSend({
  apiKey: process.env.MAILER_SEND_API_KEY,
});

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return false;

  const domain = email.split("@")[1].toLowerCase();
  return !tempEmailDomains.includes(domain);
};

const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const generateEmailTemplate = (
  name: string,
  email: string,
  message: string,
) => {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>New Contact Message</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #334155;
      margin: 0;
      padding: 0;
      background-color: #f8fafc;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid #e2e8f0;
    }
    .header {
      background-color: #3b82f6;
      padding: 28px 24px;
      text-align: center;
      border: 1px solid #60a5fa;
    }
    .header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 22px;
      font-weight: 600;
    }
    .header p {
      color: rgba(255, 255, 255, 0.9);
      margin: 8px 0 0 0;
      font-size: 15px;
    }
    .content {
      background-color: #ffffff;
      padding: 32px 24px;
    }
    .intro {
      margin-bottom: 24px;
      font-size: 16px;
    }
    .contact-details {
      background-color: #f8fafc;
      border-radius: 6px;
      padding: 16px 20px;
      margin-bottom: 24px;
      border: 1px solid #e2e8f0;
    }
    .detail-row {
      display: flex;
      margin-bottom: 12px;
      align-items: baseline;
    }
    .detail-row:last-child {
      margin-bottom: 0;
    }
    .detail-label {
      font-weight: 600;
      color: #64748b;
      width: 70px;
      flex-shrink: 0;
      font-size: 14px;
    }
    .detail-value {
      color: #334155;
      font-weight: 500;
    }
    .message-box {
      background-color: #ffffff;
      border-radius: 6px;
      padding: 0;
      margin-top: 24px;
      border: 1px solid #e2e8f0;
    }
    .message-header {
      background-color: #f1f5f9;
      padding: 12px 20px;
      border-bottom: 1px solid #e2e8f0;
      border-radius: 6px 6px 0 0;
    }
    .message-header-text {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: #334155;
    }
    .message-content {
      padding: 20px;
      white-space: pre-wrap;
      font-size: 15px;
      line-height: 1.7;
      color: #475569;
    }
    .footer {
      text-align: center;
      padding: 20px;
      background-color: #f8fafc;
      border-top: 1px solid #e2e8f0;
    }
    .footer p {
      margin: 0 0 8px 0;
      font-size: 14px;
      color: #64748b;
    }
    .footer p:last-child {
      margin-bottom: 0;
    }
    a {
      color: #2563eb;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    @media only screen and (max-width: 620px) {
      .container {
        width: 100% !important;
        margin: 0 !important;
        border-radius: 0;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Message Received</h1>
      <p>${currentDate}</p>
    </div>
    <div class="content">
      <p class="intro">Someone has reached out to you through your portfolio website:</p>
      
      <div class="contact-details">
        <div class="detail-row">
          <div class="detail-label">Name</div>
          <div class="detail-value">${name}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Email</div>
          <div class="detail-value"><a href="mailto:${email}">${email}</a></div>
        </div>
      </div>
      
      <div class="message-box">
        <div class="message-header">
          <p class="message-header-text">Message</p>
        </div>
        <div class="message-content">${message}</div>
      </div>
    </div>
    
    <div class="footer">
      <p>Sent from your portfolio contact form</p>
      <p>© ${new Date().getFullYear()} Pankaj Thakur</p>
    </div>
  </div>
</body>
</html>
  `;
};

export async function POST(request: Request) {
  try {
    const headersList = await headers();
    const forwardedFor = headersList.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0] : "unknown";

    // Apply rate limiting (2 requests per minute)
    const rateLimitResult = rateLimit(ip, 2, 60 * 1000);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { message: "Too many requests, please try again later" },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil(
              (rateLimitResult.resetAt - Date.now()) / 1000,
            ).toString(),
            "X-RateLimit-Limit": "5",
            "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
            "X-RateLimit-Reset": Math.ceil(
              rateLimitResult.resetAt / 1000,
            ).toString(),
          },
        },
      );
    }

    const contentType = request.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return NextResponse.json(
        { message: "Content-Type must be application/json" },
        { status: 415 },
      );
    }

    const { name, email, message } = await request.json();

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { message: "Name is required" },
        { status: 400 },
      );
    }

    if (!email || typeof email !== "string" || !validateEmail(email)) {
      return NextResponse.json(
        {
          message:
            "Valid email is required. Temporary or disposable email addresses are not allowed.",
        },
        { status: 400 },
      );
    }

    if (
      !message ||
      typeof message !== "string" ||
      message.trim().length === 0
    ) {
      return NextResponse.json(
        { message: "Message is required" },
        { status: 400 },
      );
    }

    const sanitizedName = sanitizeInput(name);
    const sanitizedMessage = sanitizeInput(message);

    const emailHtml = generateEmailTemplate(
      sanitizedName,
      email,
      sanitizedMessage,
    );

    // Use a verified email from your domain as the sender (this must be verified in MailerSend)
    const senderEmail = process.env.SENDER_EMAIL;
    const senderName = "Portfolio Contact Form";
    const recipientEmail = process.env.RECIPIENT_EMAIL;

    if (!senderEmail) {
      throw new Error("SENDER_EMAIL is not defined in environment variables");
    }

    if (!recipientEmail) {
      throw new Error(
        "RECIPIENT_EMAIL is not defined in environment variables",
      );
    }

    const sentFrom = new Sender(senderEmail, senderName);
    const recipients = [new Recipient(recipientEmail, "Pankaj Thakur")];

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setReplyTo(new Sender(email, sanitizedName)) // Set user's email as reply-to
      .setSubject(`New message from ${sanitizedName} via portfolio`)
      .setHtml(emailHtml);

    await mailerSend.email.send(emailParams);

    return NextResponse.json(
      { message: "Email sent successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Email sending error:", error);
    return NextResponse.json(
      { message: "Error sending email" },
      { status: 500 },
    );
  }
}
