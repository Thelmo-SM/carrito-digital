// pages/api/checkout.ts
import { NextRequest, NextResponse } from "next/server";
import { ProductOrderTypes } from "@/types/ordersTypes";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log("Datos recibidos en la API:", body); // Imprime los datos para verificar que se reciben correctamente.

  if (!body.userId || !Array.isArray(body.products) || body.products.length === 0 || !body.total || !body.shippingAddress) {
    return new NextResponse(
      JSON.stringify({ error: "Datos del pedido inválidos. Asegúrate de que todos los datos estén completos." }),
      { status: 400 }
    );
  }

  const productsMetadata = JSON.stringify(body.products);

  // Verificar si el tamaño de metadata excede los 500 caracteres
  if (productsMetadata.length > 500) {
    return new NextResponse(
      JSON.stringify({
        error: `Parece que el contenido de la orden es demasiado extenso. Por favor, asegúrate de que los campos de metadata no superen los 500 caracteres.
       Para solucionar esto, te sugiero que elimines algunos productos del carrito. Lo recomendable es que solo compres hasta 2 artículos,
        independientemente de la cantidad de unidades de cada uno. Esto ayudará a reducir el tamaño de la metadata y a procesar correctamente
       el pago. Ten en cuenta que esta es una aplicación de prueba o demo, por lo que algunos procesos pueden no estar completamente habilitados`,
      }),
      { status: 400 }
    );
  }

  try {
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
      client_reference_id: body.userId,
      metadata: {
        userId: body.userId,
        total: body.total.toString(),
        products: productsMetadata, // Aquí se pasa el JSON que no excede 500 caracteres
        shippingAddress: JSON.stringify(body.shippingAddress),
      },
    });

    if (!session.id || !session.url) {
      return new NextResponse(
        JSON.stringify({ error: "Error: No se generó la URL de sesión de Stripe." }),
        { status: 500 }
      );
    }

    return new NextResponse(JSON.stringify({ url: session.url }), { status: 200 });
  } catch (error: unknown) {
    const err = error as { raw?: { message?: string } };
    console.error("Error creando sesión de Stripe:", err);

    const isMetadataTooLong =
      err.raw?.message?.includes("metadata") &&
      err.raw?.message?.includes("too long");

    const message = isMetadataTooLong
      ? `Parece que el contenido de la orden es demasiado extenso. Por favor, asegúrate de que los campos de metadata no superen los 500 caracteres.
       Para solucionar esto, te sugerimos que elimines algunos productos del carrito. Lo recomendable es que solo compres hasta 2 artículos,
        independientemente de la cantidad de unidades de cada uno. Esto ayudará a reducir el tamaño de la metadata y a procesar correctamente
       el pago. Ten en cuenta que esta es una aplicación de prueba o demo, por lo que algunos procesos pueden no estar completamente habilitados`
      : "Error creando la sesión de pago.";

    return new NextResponse(JSON.stringify({ error: message }), {
      status: 500,
    });
  }
}