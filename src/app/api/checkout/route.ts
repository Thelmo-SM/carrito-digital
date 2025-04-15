import { createOrderInDatabase } from "@/features/Checkout/services/createOrderInDataBase";
import { NextRequest, NextResponse } from "next/server";
import { ProductOrderTypes } from "@/types/ordersTypes";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

export async function POST(req: NextRequest) {
  const body = await req.json();

  // Verificar si los datos necesarios están presentes
  if (!body.userId || !Array.isArray(body.products) || body.products.length === 0 || !body.total || !body.shippingAddress) {
    return new NextResponse(
      JSON.stringify({ error: "Datos del pedido inválidos. Asegúrate de que todos los datos estén completos." }),
      { status: 400 }
    );
  }

  try {
    console.log('Intentando crear sesión en Stripe...');
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
      line_items: body.products.map((product: ProductOrderTypes) => ({
        price_data: {
          currency: "dop",
          product_data: {
            name: product.name,
            images: [product.imageUrl],
          },
          unit_amount: Number(product.price) * 100, // Convertir a centavos
        },
        quantity: product.quantity,
      })),
      client_reference_id: body.userId, // Útil para el webhook
    });

    // Verificar que session.id esté presente
    if (!session.id) {
      return new NextResponse(
        JSON.stringify({ error: "Error: No se generó el ID de sesión de Stripe." }),
        { status: 500 }
      );
    }

    // Guardar el pedido en la base de datos con el sessionId
    await createOrderInDatabase({
      userId: body.userId,
      products: body.products,
      total: body.total,
      shippingAddress: body.shippingAddress,
      status: "pending", // El estado puede ser "pending" hasta que el pago se complete
      sessionId: session.id, // Almacenamos el sessionId para el seguimiento
    });

    // Responder con la URL de Stripe para redirigir al usuario al pago
    return new NextResponse(JSON.stringify({ url: session.url }), { status: 200 });
  } catch (err) {
    console.error("Error creando sesión de Stripe:", err);
    return new NextResponse(JSON.stringify({ error: "Error creando sesión" }), { status: 500 });
  }
}