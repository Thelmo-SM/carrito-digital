import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getOrderBySessionId } from "@/features/Checkout/services/getOrderBySessionId";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "No session_id" }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      // Aquí llamas a la función para obtener la orden relacionada con la sesión
      const orderData = await getOrderBySessionId(sessionId);

      return NextResponse.json({
        status: "paid",
        order: orderData ?? null,
      });
    } else {
      return NextResponse.json({ status: "unpaid" });
    }
  } catch (error) {
    console.error("Error al verificar el pago:", error);
    return NextResponse.json(
      { error: "Error al verificar la sesión" },
      { status: 500 }
    );
  }
}