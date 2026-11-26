import Stripe from "stripe";
export const stripeEnabled = () => !!process.env.STRIPE_SECRET_KEY;
export const stripe = () => new Stripe(process.env.STRIPE_SECRET_KEY!);
