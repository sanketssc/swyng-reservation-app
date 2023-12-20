import { NextRequest } from "next/server";
import sql from "@/lib/db";

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date");

  const bookingTimes =
    await sql`Select time from bookings where date = ${date}`;
  return new Response(JSON.stringify(bookingTimes));
}
