// pages/api/webhooks/stripe.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createOrderInDatabase } from "@/features/Checkout/services/createOrderInDataBase";
import { getOrderBySessionId } from "@/features/Checkout/services/getOrderBySessionId";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

export async function POST(request: NextRequest) {
  const sig = request.headers.get("stripe-signature")!;
  const body = await request.text();

  try {
    const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);

    // Verifica que el evento sea de un pago completado
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const sessionId = session.id;

      if (!sessionId) {
        console.error('session.id no está definido');
        return NextResponse.json({ error: 'Falta sessionId' }, { status: 400 });
      }

      // Buscar el pedido que fue guardado con este sessionId
      const orderData = await getOrderBySessionId(sessionId);

      if (orderData) {
        const updatedOrder = await createOrderInDatabase({
          ...orderData,
          status: 'paid',
        });
        console.log('Orden actualizada en la base de datos:', updatedOrder);
      } else {
        console.warn('No se encontró ningún pedido con el sessionId:', sessionId);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error al procesar el webhook:', error);
    return NextResponse.json({ error: 'Error al procesar el webhook' }, { status: 500 });
  }
}
