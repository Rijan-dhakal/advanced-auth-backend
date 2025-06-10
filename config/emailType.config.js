import { generateVerifyTemplate } from "../utils/email-templates.js";

export const emailTemplates = [
  {
    label: "OTP Email",
    generateSubject: () => `Verify your email`,
    generateBody: (data) => generateVerifyTemplate({ otpCode: data.otpCode, email: data.email }),
  },
];