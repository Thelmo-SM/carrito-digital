//En proceso

// // pages/api/checkout-session.ts
// import type { NextApiRequest, NextApiResponse } from 'next';
// import Stripe from 'stripe';

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
//   apiVersion: '2022-11-15',
// });

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const { session_id } = req.query;

//   if (!session_id || typeof session_id !== 'string') {
//     return res.status(400).json({ error: 'Session ID is required' });
//   }

//   try {
//     const session = await stripe.checkout.sessions.retrieve(session_id, {
//       expand: ['line_items', 'payment_intent'],
//     });

//     return res.status(200).json({ session });
//   } catch (error) {
//     console.error('Error retrieving Stripe session:', error);
//     return res.status(500).json({ error: 'Failed to retrieve session' });
//   }
// }
