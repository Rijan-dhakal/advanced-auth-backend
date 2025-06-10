export const generateVerifyTemplate = ({ otpCode, email }) => `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f4f7fa;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <tr>
            <td style="background-color: #4a90e2; text-align: center;">
                <p style="font-size: 54px; line-height: 54px; font-weight: 800; color: white;">Advanced Auth Demo</p>
            </td>
        </tr>
        <tr>
            <td style="padding: 40px 30px;">
                <p style="font-size: 16px; margin-bottom: 25px;">Hi there${email ? ` (${email})` : ""},</p>
                <p style="font-size: 16px; margin-bottom: 25px;">
                    Welcome to the <strong>Advanced Auth Demo</strong>! <br>
                    To continue, please use the One Time Password (OTP) below to verify your email address:
                </p>
                <h1 style="background: #f4f4f4; padding: 10px; text-align: center; border-radius: 5px; color: #333; letter-spacing: 2px;">
                    ${otpCode}
                </h1>
                <p style="font-size: 16px; margin-top: 25px;">
                    This code is valid for 15 minutes. If you didn't request this, you can safely ignore this email.
                </p>
                
            </td>
        </tr>
    </table>
</div>
`;


