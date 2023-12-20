import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { type Stripe } from "stripe";
import { randomUUID } from "crypto";
const stripe: Stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
import sql from "@/lib/db";

export default async function page({
  searchParams,
}: {
  searchParams: {
    time: string;
  };
}) {
  const stripe_session_id = cookies().get("stripe_session_id")?.value as string;
  if (stripe_session_id) {
    if (
      (await stripe.checkout.sessions.retrieve(stripe_session_id)).status ===
      "open"
    ) {
      const x = await stripe.checkout.sessions.expire(stripe_session_id);
    }
  }

  const id = cookies().get("id")?.value as string;
  if (id) {
    const deleted_data =
      await sql`DELETE FROM temp_bookings WHERE id = ${id} returning *`;
    redirect("/api/deleteid");
  }
  const d1 = parseInt(searchParams.time);
  const date = new Date(d1);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hhmm = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const today = new Date();
  const max_date = new Date(today.getFullYear(), today.getMonth() + 2, 0);
  const min_date = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  if (date.valueOf() > max_date.valueOf()) {
    redirect("/");
  }
  if (date.valueOf() < min_date.valueOf()) {
    redirect("/");
  }
  if (date.getDay() === 0 || date.getDay() === 6) {
    redirect("/");
  }
  return (
    <div className="flex justify-center items-center h-screen w-full">
      <form
        className="flex flex-col gap-5 w-full md:w-1/2 px-10 md:border items-center rounded-lg py-20"
        action={async (formdata: FormData) => {
          "use server";
          const id = randomUUID();
          cookies().set("id", id);

          const name = formdata.get("name") as string;
          const email = formdata.get("email") as string;
          const phone = formdata.get("phone") as string;

          const a = `${year}-${month}-${day}`;
          const x =
            await sql`INSERT into temp_bookings (id,name, email, phone, date, time) VALUES (${id},${name},${email},${phone},${a},${hhmm}) RETURNING *`;
          redirect("/schedule/payment");
        }}
      >
        <h1 className="text-3xl font-bold mb-5 text-center">
          Schedule a Meeting
        </h1>
        <h2 className="text-xl font-semibold -mb-3">
          Date:{" "}
          {date.toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </h2>
        <h2 className="text-xl font-semibold mb-10">
          Time:{" "}
          {date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </h2>
        <div className="w-full md:w-5/6 flex flex-col gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            required
            aria-required
            name="name"
            type="text"
            placeholder="Name"
            className="bg-black"
          />
        </div>
        <div className="w-full md:w-5/6 flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            required
            aria-required
            name="email"
            type="email"
            placeholder="Email"
            className="bg-black"
          />
        </div>
        <div className="w-full md:w-5/6 flex flex-col gap-2">
          <Label htmlFor="phone">
            Phone <span className="text-xs">(without country code)</span>
          </Label>
          <Input
            required
            aria-required
            name="phone"
            type="tel"
            pattern="[0-9]{10}"
            placeholder="Phone"
            className="bg-black"
          />
        </div>
        <Button type="submit" className="w-full md:w-5/6">
          Submit
        </Button>
      </form>
    </div>
  );
}
