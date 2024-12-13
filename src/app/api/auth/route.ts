import { currentUser } from '@clerk/nextjs/server';
import prisma from '@/lib/prismaclient';
import Stripe from 'stripe';

export async function POST(req: Request) {
  try {

    const user = await currentUser();

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not authenticated' }), { status: 401 });
    }

    const email = user.primaryEmailAddress?.emailAddress;

    if (!email) {
      return new Response(JSON.stringify({ error: 'User does not have an email address' }), { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
    const customer = await stripe.customers.create({
      email,
    });


    if (!existingUser) {
      await prisma.user.create({
        data: {
          name: user.fullName || 'Unknown',
          email,
          stripeCustomerId: customer.id,
        },
      });
    }

    return new Response(JSON.stringify({ message: 'User synced successfully' }), { status: 200 });

  } catch (error) {
    console.error('Error syncing user:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
