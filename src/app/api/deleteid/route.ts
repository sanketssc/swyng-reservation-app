import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const stripe_session_id = await cookies().get("stripe_session_id");

  if (stripe_session_id) {
    await cookies().delete("stripe_session_id");
  }
  const id = await cookies().get("id");
  if (id) {
    await cookies().delete("id");
  }
  return Response.redirect(process.env.NEXT_PUBLIC_SITE_URL as string);
}
