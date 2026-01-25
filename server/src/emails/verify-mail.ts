export const verifyEmailTemplate = (otp: string, name: string): string => {
  return `
  <div style="font-family: Arial, sans-serif; max-width: 600px;">
    <h2>Email Verification</h2>
    <p>Hi ${name},</p>
    <p>Your verification code is:</p>

    <div style="font-size: 32px; font-weight: bold; margin: 20px 0;">
      ${otp}
    </div>

    <p>This code will expire in <strong>10 minutes</strong>.</p>

    <p>If you didn’t create this account, you can safely ignore this email.</p>

    <hr />
    <small>
      This app does not provide medical advice.
    </small>
  </div>
  `;
};
