import { CheckCircleIcon } from "lucide-react";
import Link from "next/link";
import Timer from "../timer";
import { cookies } from "next/headers";
import sql from "@/lib/db";
import { redirect } from "next/navigation";
import { type Stripe } from "stripe";
const stripe: Stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function page() {
  const session_id = cookies().get("stripe_session_id")?.value as string;

  if (!session_id) {
    redirect("/");
  }
  if ((await stripe.checkout.sessions.retrieve(session_id)).status === "open") {
    redirect("/schedule/failed?reason=payment_not_completed");
  }
  const id = cookies().get("id")?.value as string;
  if (!id) {
    redirect("/");
  }
  const deleted_data =
    await sql`DELETE FROM temp_bookings WHERE id = ${id} returning *`;
  if (deleted_data.length === 0) {
    redirect("/api/deleteid");
  }
  const booking = deleted_data[0];
  const { name, email, phone, date, time } = booking;

  const entered_data =
    await sql`INSERT INTO bookings (name, email, phone, date, time) VALUES (${name}, ${email}, ${phone}, ${date}, ${time}) returning *`;

  return (
    <div className="flex flex-col items-center justify-center gap-32 w-full h-screen px-5 text-center">
      <div className="flex flex-col gap-5 items-center">
        <CheckCircleIcon className="h-20 w-20 text-green-500" />
        <h1 className="text-3xl font-bold">Payment Successful</h1>
        <p className="text-xl">
          Thank you for booking. We will be in touch shortly.
        </p>
      </div>
      {/* redirect user to home page */}
      <div>
        You will be redirected to home page in <Timer /> seconds Click{" "}
        <Link className="underline" href={"/api/deleteid"}>
          here
        </Link>{" "}
        to go back to home page
      </div>
    </div>
  );
}
