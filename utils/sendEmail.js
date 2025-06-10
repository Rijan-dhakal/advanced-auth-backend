import { emailTemplates } from '../config/emailType.config.js'
import transporter, { accountEmail } from '../config/nodemailer.config.js'

export const sendOtpEmail = async ( to, otpCode ) => {
  if (!to || !otpCode) throw new Error('Missing required parameters');

  // Find the OTP email template
  const template = emailTemplates.find((t) => t.label === "OTP Email");

  if (!template) throw new Error('Invalid email type');

  // Prepare the email content
  const mailInfo = {
    otpCode: otpCode, // OTP code to be sent
    email: to,        // Email of the recipient
  }

  // Generate the email body and subject
  const message = template.generateBody(mailInfo);
  const subject = template.generateSubject(mailInfo);

  const mailOptions = {
    from: accountEmail,
    to: to,
    subject: subject,
    html: message,
  }

  // Send the email using the transporter
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) return console.log(error, 'Error sending email');

    console.log('Email sent: ' + info.response);
  });
}
