//verify-payment/route.ts

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getOrderBySessionId } from "@/features/Checkout/services/getOrderBySessionId";
import { createOrderInDatabase } from "@/features/Checkout/services/createOrderInDataBase";
import { productsTypes } from "@/types/productTypes";
import { createNotification } from "@/features/notifications/services/createNotification";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");
  
  if (!sessionId) {
    return NextResponse.json({ error: "No session_id" }, { status: 400 });
  }

  try {
    // Verificar si ya existe una orden creada
    const existingOrder = await getOrderBySessionId(sessionId);

    if (existingOrder) {
      return NextResponse.json({ status: "paid", order: existingOrder });
    }

    // Si no existe, consultar directamente a Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['customer_details'],
    });

    if (session.payment_status === "paid") {
      const rawProducts = JSON.parse(session.metadata?.products || '[]');
    
      const products = rawProducts.map((product: productsTypes) => ({
        ...product,
        price: Number(product.price),
        reviews: [], // Puedes llenarlo después si es necesario
      }));
    
      const shippingAddress = session.metadata?.shippingAddress
      ? JSON.parse(session.metadata.shippingAddress)
      : null;;

        console.log("🛣️ Dirección completa desde Stripe:", session.customer_details?.address);

      const newOrder = await createOrderInDatabase({
        id: '',  // Aquí puedes asignar un valor predeterminado vacío
        sessionId: session.id,
        userId: session.metadata?.userId || 'desconocido',
        total: Number(session.metadata?.total),
        status: 'Pendiente',
        createdAt: new Date(),
        products,
        shippingAddress: shippingAddress,
        client: session.customer_details?.name || 'Desconocido',
        orderId: `ORD-${Date.now()}`,
      });

      await createNotification(
        newOrder.userId ?? '',
        "¡Compra realizada!",
        `Tu pedido fue exitoso. Gracias por comprar con nosotros. 
        <a href="/account/orders/${newOrder.sessionId}" style="color: #437BAF; text-decoration: underline;"
         target="_blank">Ver detalles de tu compra aquí</a>`
      );
      

      return NextResponse.json({ status: "paid", order: newOrder });
    } else {
      return NextResponse.json({ status: "unpaid" });
    }
  } catch (error) {
    console.error("Error al verificar la sesión:", error);
    return NextResponse.json(
      { error: "Error al verificar la sesión" },
      { status: 500 }
    );
  }
}
