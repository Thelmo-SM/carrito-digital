import { getOrderDetail } from "@/features/Account/services/orderDetail";
import { Metadata } from "next";
import OrderDetailComponent from "@/features/Account/OrdersComponent/orderDetailComponent";

type OrderIdProps = {
  params: {
    session_id: string;
  };
};

// Generación de metadatos para la página de detalles del pedido
export async function generateMetadata({ params }: OrderIdProps): Promise<Metadata> {
  const order = await getOrderDetail(params.session_id);

  return {
    title: order ? `Orden ID: ${order.id}` : "Orden no encontrada",
  };
}

// Componente de la página
export default function OrderDetailPage({  }: OrderIdProps) {
  return <OrderDetailComponent />;
}
