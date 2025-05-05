'use client';

import Link from 'next/link';
import { ButtonForm } from '@/components/UI';

const ChatButton = ({ senderId }: { senderId: string }) => {
  const adminId = "IcCXOSdR31R6XGnAm22R6nS1x0P2";
  const chatId = [senderId, adminId].sort().join("_");

  return (
    <Link href={`/account/messages/${chatId}`}>
      <ButtonForm>
        Iniciar chat con el administrador
      </ButtonForm>
    </Link>
  );
};

export default ChatButton;
