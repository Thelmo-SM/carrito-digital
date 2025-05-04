'use client';

import Link from 'next/link';

const ChatButton = ({ senderId }: { senderId: string }) => {
  const adminId = "IcCXOSdR31R6XGnAm22R6nS1x0P2"; // ID fijo del admin
  const chatId = [senderId, adminId].sort().join("_"); // Siempre ordenado para evitar duplicados

  return (
    <Link href={`/messages/${chatId}`}>
      <button>
        Iniciar chat con el administrador
      </button>
    </Link>
  );
};

export default ChatButton;
