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

export const sendWelcomeEmail = async (to, username) => {
  if (!to || !username) throw new Error('Missing required parameters');

  // Find the welcome email template
  const template = emailTemplates.find((t) => t.label === "Welcome Email");

  if (!template) throw new Error('Invalid email type');

  // Prepare the email content
  const mailInfo = {
    username: username, // Username of the recipient
    email: to,          // Email of the recipient
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


export const sendPasswordResetEmail = async (to, resetToken) => { 
  if (!to || !resetToken) throw new Error('Missing required parameters');

  // Find the password reset email template
  const template = emailTemplates.find((t) => t.label === "Reset Password");

  if (!template) throw new Error('Invalid email type');

  // Prepare the email content
  const mailInfo = {
    email: to,          // Email of the recipient
    resetToken: resetToken, // Reset token for password reset link
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


export const sendPasswordResetSuccessEmail = async (to) => {
  
    if (!to ) throw new Error('Missing required parameters');

  // Find the password reset email template
  const template = emailTemplates.find((t) => t.label === "Reset Password Successful");

  if (!template) throw new Error('Invalid email type');

  // Prepare the email content
  const mailInfo = {
    email: to,          // Email of the recipient
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
