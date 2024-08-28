import { NextResponse, NextRequest } from 'next/server';
import { sendMail } from '@/utils/mailsender';

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { email, subject, content } = body
  try {
    const response = await sendMail(
      [body.email],
      subject,
      content
    );
    return NextResponse.json({ message: 'Email sent successfully!', response });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
