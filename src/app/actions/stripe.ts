"use server"

import prisma from "@/lib/prismaclient";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Stripe from "stripe"


export const redirectToCheckout = async (priceId: string) => {
    if(![process.env.STRIPE_20_PACK, process.env.STRIPE_50_PACK, process.env.STRIPE_10_PACK].includes(priceId)) {
        throw new Error('Invalid priceId');
    }

    const getUser = await currentUser()

    const user = await prisma.user.findUnique({
        where: {
            id: getUser?.id
        },
        select: {
            stripeCustomerId: true
        }

    })

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || " ")
    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price: priceId,
                quantity: 1
            }
        ],
        customer: user?.stripeCustomerId || undefined,
        mode: 'payment',
        success_url : `http://localhost:3000/success`,
        cancel_url : `http://localhost:3000/cancel`


    })

    if(!session.url) {
        throw new Error('Failed to create session')
    }

    redirect(session.url)


}
    