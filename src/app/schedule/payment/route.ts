import { type Stripe } from "stripe";
const stripe: Stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

import { cookies } from "next/headers";

export async function GET() {
  const session = await stripe.checkout.sessions.create({
    ui_mode: "hosted",
    line_items: [
      {
        price: "price_1OOllHSJGyrZxv9MV0zAXibD",
        quantity: 1,
      },
    ],
    allow_promotion_codes: true,
    mode: "payment",
    success_url: `${
      process.env.NEXT_PUBLIC_SITE_URL as string
    }/schedule/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/schedule/failed`,
  });
  cookies().set("stripe_session_id", session.id);
  return Response.redirect(session.url as string, 303);
}
