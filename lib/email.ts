import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) => {
  try {
    await resend.emails.send({
      from: 'Blogs <Blogs@resend.dev>', // Use your domain if verified
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error("Email send error:", error);
  }
};
