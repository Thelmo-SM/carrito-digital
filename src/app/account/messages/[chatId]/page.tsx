// app/account/messages/[chatId]/page.tsx

import { Metadata } from "next";
import ChatComponentId from "@/features/Message/components/ChatComponentId";

type PageProps = {
  params: Promise<{ chatId: string }>;
};

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const { chatId } = await params;

  return {
    title: `Chat con ${chatId}`,
    description: `Estás conversando con ${chatId.replace("_", " ")}`,
  };
};

const ChatPage = async ({ params }: PageProps) => {
  const { chatId } = await params;

  if (!chatId.includes("_")) {
    return <div>Chat inválido</div>;
  }

  return <ChatComponentId chatId={chatId} />;
};

export default ChatPage;
