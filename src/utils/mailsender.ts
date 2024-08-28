import { Resend } from 'resend';

const resend = new Resend(process.env.MAIL_KEY);

export const sendMail = async (to: string[], subject: string, content: string) => {
  try {
    const response = await resend.emails.send({
        from: 'info@tradenexusonline.com',
      to,
      subject,
      
      html: content
    });
    return response;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};

