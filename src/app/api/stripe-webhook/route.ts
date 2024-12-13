import prisma from "@/lib/prismaclient";
import { headers } from "next/headers";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const sig = (await headers()).get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event: Stripe.Event;

  try {
    if (!sig || !webhookSecret) {
      return new Response(JSON.stringify({ error: "Missing signature or webhook secret" }), {
        status: 400,
      });
    }
    event = Stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    return new Response(JSON.stringify({ error: "Invalid signature" }), { status: 400 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session;
      const customer = session.customer as string;

      const retrievedSession = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ["line_items"],
      });

      const lineItems = retrievedSession.line_items;

      if (lineItems && lineItems.data.length > 0) {
        const priceId = lineItems.data[0]?.price?.id || null;
        console.log(priceId);

        if (priceId) {
          let credits = 0;

          if (priceId === process.env.STRIPE_10_PACK) credits = 10;
          else if (priceId === process.env.STRIPE_20_PACK) credits = 25;
          else if (priceId === process.env.STRIPE_50_PACK) credits = 100;

          if (credits > 0) {
            await prisma.user.update({
              where: {
                stripeCustomerId: customer,
              },
              data: {
                credits: {
                  increment: credits,
                },
              },
            });
          }
        }
      }
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
      break;
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
}
