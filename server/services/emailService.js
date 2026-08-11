import nodemailer from 'nodemailer';

/**
 * Configure Nodemailer transport
 * Checks env vars for SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS.
 */
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || process.env.SMTP_EMAIL || 'fake_user',
    pass: process.env.SMTP_PASS || process.env.SMTP_PASSWORD || 'fake_password',
  },
});

/**
 * Verify SMTP Transport Connection
 */
export const verifySmtpConnection = async () => {
  if (!process.env.SMTP_HOST) {
    return {
      connected: false,
      mode: 'MOCK_MODE',
      message: 'SMTP_HOST not set in .env. Running in Mock Console Dispatch mode.',
    };
  }

  try {
    await transporter.verify();
    return {
      connected: true,
      mode: 'LIVE_SMTP',
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      message: 'SMTP transport connection established successfully.',
    };
  } catch (err) {
    return {
      connected: false,
      mode: 'SMTP_ERROR',
      error: err.message,
      message: `Failed to connect to SMTP server: ${err.message}`,
    };
  }
};

/**
 * General Send Email Function
 */
export const sendEmail = async (options) => {
  try {
    const { to, subject, text, html } = options;

    const mailOptions = {
      from: `${process.env.FROM_NAME || 'DevHunt SRM'} <${process.env.FROM_EMAIL || process.env.SMTP_EMAIL || 'noreply@devhuntsrm.com'}>`,
      to,
      subject,
      text,
      html,
    };

    // If we have no real credentials configured, log to console for development
    if (!process.env.SMTP_HOST) {
      console.log('\n==================================================');
      console.log('📧 MOCK EMAIL DISPATCHED (Nodemailer)');
      console.log('==================================================');
      console.log(`To:      ${mailOptions.to}`);
      console.log(`Subject: ${mailOptions.subject}`);
      console.log(`Text:    ${mailOptions.text || '(HTML Body)'}`);
      console.log('==================================================\n');
      return true;
    }

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email Service] Message sent via SMTP: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`[Email Service Error]: ${error.message}`);
    return false;
  }
};

/**
 * Send Password Reset Email with Kinetic Brutalist HTML Template
 */
export const sendPasswordResetEmail = async ({ to, name, resetUrl }) => {
  const subject = '🔑 DevHunt SRM — Password Reset Key Request';
  const text = `Hi ${name},\n\nYou requested a password reset for your DevHunt SRM account.\n\nPlease navigate to the link below within 10 minutes to reset your access key:\n${resetUrl}\n\nIf you did not request this, please ignore this email.`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Courier New', Courier, monospace; background-color: #09090b; color: #fafafa; margin: 0; padding: 24px; }
        .container { max-width: 560px; margin: 0 auto; background-color: #131315; border: 2px solid #3F3F46; padding: 32px; }
        .header { border-bottom: 2px solid #dfe104; padding-bottom: 16px; margin-bottom: 24px; }
        .title { font-size: 24px; font-weight: 900; color: #dfe104; text-transform: uppercase; margin: 0; }
        .badge { display: inline-block; background-color: #dfe104; color: #09090b; padding: 4px 8px; font-weight: 800; font-size: 12px; margin-top: 8px; }
        .btn { display: inline-block; background-color: #dfe104; color: #09090b; text-decoration: none; padding: 14px 28px; font-weight: 900; text-transform: uppercase; border: 2px solid #dfe104; margin: 24px 0; }
        .footer { font-size: 11px; color: #a1a1aa; border-top: 1px solid #3F3F46; padding-top: 16px; margin-top: 32px; text-transform: uppercase; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 class="title">DEVHUNT SRM</h1>
          <div class="badge">SECURE SMTP RECOVERY DISPATCH</div>
        </div>
        <p style="font-size: 16px;">GREETINGS, <strong>${name.toUpperCase()}</strong>,</p>
        <p style="color: #a1a1aa; line-height: 1.6;">
          An access key (password) reset authorization request was initiated for your registered campus developer node.
        </p>
        <p style="color: #fafafa; font-weight: bold;">
          CLICK THE LINK BELOW TO AUTHORIZE PASSWORD OVERWRITE (VALID FOR 10 MINUTES):
        </p>
        <a href="${resetUrl}" target="_blank" class="btn">OVERWRITE ACCESS KEY →</a>
        <p style="font-size: 12px; color: #71717a; word-break: break-all;">
          Or paste this token link directly into your browser URL bar:<br>
          <span style="color: #dfe104;">${resetUrl}</span>
        </p>
        <div class="footer">
          DEVHUNT SRM METRICS & PROTOCOLS /// IF YOU DID NOT INITIATE THIS ACTION, NO CHANGES HAVE BEEN MADE.
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to, subject, text, html });
};

