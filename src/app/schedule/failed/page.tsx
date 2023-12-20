import { cookies } from "next/headers";
import { type Stripe } from "stripe";
const stripe: Stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
import { XCircleIcon } from "lucide-react";
import Link from "next/link";
import Timer from "../timer";
import { redirect } from "next/navigation";
import sql from "@/lib/db";

export default async function page({
  searchParams,
}: {
  searchParams: { reason: string };
}) {
  const session_id = cookies().get("stripe_session_id")?.value as string;
  if (!session_id) {
    redirect("/");
  }
  if ((await stripe.checkout.sessions.retrieve(session_id)).status === "open") {
    const x = await stripe.checkout.sessions.expire(session_id);
  } else {
    redirect("/");
  }
  const id = cookies().get("id")?.value as string;
  if (!id) {
    redirect("/");
  }
  const deleted_data =
    await sql`DELETE FROM temp_bookings WHERE id = ${id} returning *`;

  return (
    <div className="flex flex-col items-center justify-center gap-32 w-full h-screen px-5 text-center">
      <div className="flex flex-col gap-5 items-center">
        <XCircleIcon className="h-20 w-20 text-red-500" />
        <h1 className="text-3xl font-bold">Payment Failed</h1>
        <p className="text-xl">
          {searchParams.reason === "payment_not_completed" ? (
            <span>Payment was not completed. Please try again</span>
          ) : (
            <span>
              There was an error processing your payment. Please try again.
            </span>
          )}
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
