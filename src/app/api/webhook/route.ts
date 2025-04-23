//En proceso

// import { NextRequest, NextResponse } from "next/server";
// import Stripe from "stripe";
// import { createOrderInDatabase } from "@/features/Checkout/services/createOrderInDataBase";
// import { updateOrderStatus } from "@/features/Dashboard/services/updateOrderStatus";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: "2025-02-24.acacia",
// });

// const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// export async function POST(request: NextRequest) {
//   const sig = request.headers.get("stripe-signature")!;
//   const body = await request.text();

//   try {
//     const event = stripe.webhooks.constructEvent(body, sig, endpointSecret);

//     console.log("📦 Webhook recibido:", event.type);

//     if (event.type === 'checkout.session.completed') {
//       const session = event.data.object as Stripe.Checkout.Session;
//       console.log("✅ Session recibida:", session.id);

//       const sessionId = session.id;
//       const userId = session.metadata?.userId;
//       const total = Number(session.metadata?.total);
//       const shippingAddress = JSON.parse(session.metadata?.shippingAddress || "{}");
//       const products = JSON.parse(session.metadata?.products || "[]");

//       if (!userId || !total || !products || !session.metadata?.userId || !session.metadata?.total || !session.metadata?.products) {
//         console.error("⚠️ Datos incompletos en metadata");
//         return NextResponse.json({ error: "Datos incompletos en metadata" }, { status: 400 });
//       }

//       // Crear la orden en la base de datos
//       const orderId = await createOrderInDatabase({
//         userId,
//         products,
//         total,
//         shippingAddress,
//         status: "pending", // Mantén el estado como 'pending' al principio
//         sessionId,
//       });

//       console.log("✅ Orden creada correctamente con ID:", orderId);

//       // Actualizar la orden a 'paid' después de que Stripe confirme el pago
//       await updateOrderStatus(orderId, 'paid');
//       console.log("✅ Orden actualizada a 'paid'");
//     }

//     return NextResponse.json({ received: true });
//   } catch (error) {
//     console.error("❌ Error al procesar el webhook:", error);
//     return NextResponse.json({ error: 'Error al procesar el webhook' }, { status: 500 });
//   }
// }
