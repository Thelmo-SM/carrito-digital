import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createOrderInDatabase } from "@/features/Checkout/hook/createOrderInDataBase";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2022-11-15', // Asegúrate de que sea la versión correcta de la API de Stripe
});

export async function POST(request) {
    try {
        const orderData = await request.json();
        console.log('Datos del pedido:', orderData);

        // Crear una sesión de pago con Stripe
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: orderData.products.map(product => ({
                price_data: {
                    currency: 'usd', // O la moneda que estés usando
                    product_data: {
                        name: product.name,
                        images: [product.imageUrl],
                    },
                    unit_amount: product.price * 100, // Asegúrate de enviar el precio en centavos
                },
                quantity: product.quantity,
            })),
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`, // URL de éxito
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`, // URL de cancelación
        });
        console.log(session)

        // Guardar el pedido en la base de datos
        const orderId = await createOrderInDatabase(orderData); // Guardar el pedido en la base de datos

        // Redirigir al usuario a Stripe Checkout
        return NextResponse.json({ orderId, sessionId: session.id, sessionUrl: session.url });
    } catch (error) {
        console.error('Error al procesar el pedido:', error);
        return NextResponse.json({ error: 'error.message' }, { status: 500 });
    }