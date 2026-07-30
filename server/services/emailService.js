import nodemailer from 'nodemailer';

/**
 * Configure Nodemailer transport
 * In development without real SMTP credentials, we use a fake ethereal account or simple console logs.
 */
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: process.env.SMTP_PORT || 587,
  auth: {
    user: process.env.SMTP_USER || 'fake_user',
    pass: process.env.SMTP_PASS || 'fake_password',
  },
});

export const sendEmail = async (options) => {
  try {
    const { to, subject, text, html } = options;

    const mailOptions = {
      from: `${process.env.FROM_NAME || 'DevHunt SRM'} <${process.env.FROM_EMAIL || 'noreply@devhuntsrm.com'}>`,
      to,
      subject,
      text,
      html,
    };

    // If we have no real credentials, just log it instead of throwing connection errors
    if (!process.env.SMTP_HOST) {
      console.log('\n==================================================');
      console.log('📧 MOCK EMAIL DISPATCHED (Nodemailer)');
      console.log('==================================================');
      console.log(`To:      ${mailOptions.to}`);
      console.log(`Subject: ${mailOptions.subject}`);
      console.log(`Body:    ${mailOptions.text || 'HTML Content...'}`);
      console.log('==================================================\n');
      return true;
    }

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email Service] Message sent: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`[Email Service Error]: ${error.message}`);
    return false;
  }
};
