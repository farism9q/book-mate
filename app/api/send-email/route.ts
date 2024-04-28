import { BookEmailTemplate } from "@/components/emails/book";
import { currentUser } from "@clerk/nextjs";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    const { bookTitle, bookImageUrl, bookText, friendEmail, allowViewName } =
      await req.json();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!bookTitle || !bookImageUrl || !bookText || !friendEmail) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const data = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: [friendEmail],
      subject: "A recommendation from a friend! 📚",
      react: BookEmailTemplate({
        bookImageUrl,
        bookTitle,
        bookText,
        friendName: allowViewName
          ? user.firstName! + user.lastName
          : "a friend",
      }),
    });

    return Response.json(data);
  } catch (error) {
    return Response.json({ error });
  }
}
