import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

export const accountEmail = process.env.MAIL_USER;

// Check if email password is available
const emailPassword = process.env.EMAIL_PASSWORD;
if (!emailPassword || !accountEmail) {
  console.warn("Mail sender email or password is not set in enviroment variable");
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: accountEmail,
    pass: emailPassword
  }
});

// Verify the connection configuration
transporter.verify(function(error, success) {
  if (error) {
    console.log('Server connection error:', error);
  } else {
    console.log('Mailserver is running');
  }
});

export default transporter;