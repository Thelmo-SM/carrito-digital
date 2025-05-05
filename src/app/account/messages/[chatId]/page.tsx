// app/messages/[chatId]/page.tsx
import ChatComponentId from "@/features/Message/components/ChatComponentId";

export default function ChatPage({ params }: { params: { chatId: string } }) {
  const { chatId } = params;

  // VALIDACIÓN EN EL SERVIDOR
  if (!chatId.includes("_")) {
    // opcional: redirigir, mostrar error o 404
    return <div>Chat inválido</div>;
  }

  return <ChatComponentId chatId={chatId} />;
}
