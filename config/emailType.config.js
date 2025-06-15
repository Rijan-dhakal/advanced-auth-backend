import { generatePasswordResetSuccessTemplate, generatePasswordResetTemplate, generateVerifyTemplate, generateWelcomeTemplate } from "../utils/email-templates.js";

export const emailTemplates = [
  {
    label: "OTP Email",
    generateSubject: () => `Verify your email`,
    generateBody: (data) => generateVerifyTemplate({ otpCode: data.otpCode, email: data.email }),
  },
  {
    label: "Welcome Email",
    generateSubject: (data) => `Welcome to our service, ${data.username}!`,
    generateBody: (data) => generateWelcomeTemplate({ username: data.username, email: data.email }),
  },
  {
    label: "Reset Password",
    generateSubject: () => `Reset your password`,
    generateBody: (data) => generatePasswordResetTemplate({ email: data.email, resetLink: `${process.env.CLIENT_URL}/reset-password?token=${data.resetToken}` }),
  },
  {
    label: "Reset Password Successful",
    generateSubject: () => `Password reset successful`,
    generateBody: (data) => generatePasswordResetSuccessTemplate({ email: data.email })
  }

  ];