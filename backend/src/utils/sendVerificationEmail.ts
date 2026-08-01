import nodemailer from 'nodemailer';

export const sendVerificationEmail = async (to: string, verificationToken: string): Promise<void> => {
  const user = process.env.EMAIL_USER || process.env.EMAIL_ID;
  const pass = process.env.EMAIL_PASS;
  const baseUrl = process.env.BASE_URL || 'http://localhost:5000';

  if (!user || !pass) {
    console.log(`[sendVerificationEmail] EMAIL_USER/EMAIL_PASS not set. Verification link for ${to}: ${baseUrl}/api/users/verify?token=${verificationToken}`);
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
    });

    const verificationUrl = `${baseUrl}/api/users/verify?token=${verificationToken}`;
    await transporter.sendMail({
      from: `Art Corner <${user}>`,
      to,
      subject: 'Verify Your Email',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Verify Your Account</h2>
          <p>Thank you for signing up for Art Corner. Please verify your account by clicking the link below:</p>
          <a href="${verificationUrl}" style="background-color: #348dc4; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
        </div>
      `,
    });
  } catch (err) {
    console.error(`[sendVerificationEmail] Error sending verification email to ${to}:`, err);
  }
};

export default sendVerificationEmail;
