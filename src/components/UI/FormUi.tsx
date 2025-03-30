import { ReactNode } from "react";
import style from '@/styles/producForm.module.css';

interface FormUiProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
  className?: string;
}

export const FormUi = ({ onSubmit, children }: FormUiProps) => {
  return (
    <form onSubmit={onSubmit} className={style.formContainer}>
      {children}
    </form>
  );
};