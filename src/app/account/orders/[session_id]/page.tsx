import { getOrderDetail } from "@/features/Account/services/orderDetail";
import { Metadata } from "next";
import OrderDetailComponent from "@/features/Account/OrdersComponent/orderDetailComponent";
import { PageProps } from "../../../../../.next/types/app/page";

type Props = PageProps & {
  params: {
    session_id: string; // Mantén esta propiedad tal cual
  };
};

// Aquí generamos los metadatos de la página
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const order = await getOrderDetail(params.session_id);

  return {
    title: order ? `Orden ID: ${order.id}` : 'Orden no encontrada',
  };
}

// El componente de la página
export default function OrderDetailPage({ params }: Props) {
  return <OrderDetailComponent session_id={params.session_id} />;
}
