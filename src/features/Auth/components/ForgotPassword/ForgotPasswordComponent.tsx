'use client';

//import { usersTypes } from "@/types/usersTypes";
import { sendResetEmail } from "../../services/sendResetEmailService";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import style from '@/styles/form.module.css';
import { ContainerUi, FormUi, DivForm, LabelUi, ButtonSubmitUi, InputUi, MessageErrror } from "@/components/UI";

export const ForgotPasswordComponent = () => {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const isValidEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleBlur = () => {
    if (!inputValue) {
      setError("Por favor, ingresa un correo electrónico.");
    } else if (!isValidEmail(inputValue)) {
      setError("Por favor, ingresa un correo válido.");
    } else {
      setError("");
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // 🔹 Importante para evitar recarga de página

    if (!inputValue) {
      setError("Por favor, ingresa un correo electrónico.");
      return;
    }

    if (!isValidEmail(inputValue)) {
      setError("Por favor, ingresa un correo válido.");
      return;
    }

    setError("");

    try {
      await sendResetEmail(inputValue);
      console.log("Email enviado exitosamente");
      router.push("/login");
    } catch (error) {
      console.error("Error al intentar enviar el correo: ", error);
    }
  };

  return (
    <div className={style.container}>
      <div className={style.forgotContainer}>
    <ContainerUi>
      <h1 className={style.title}>Recuperar contraseña</h1>
    <FormUi
      onSubmit={onSubmit}
      >
      <p className={style.textForgot}>Te enviaremos un correo electrónico para que puedas recuperar tu contraseña</p>
      <DivForm>
       <LabelUi htmlFor="email">Correo electrónico</LabelUi>
       <InputUi
         type="email"
         id="email"
         name="email"
         value={inputValue}
         onChange={(e) => setInputValue(e.target.value)}
         onBlur={handleBlur}
         required
       />
       {error && <MessageErrror>{error}</MessageErrror>}
      </DivForm>

      <ButtonSubmitUi
        type="submit"
      >
        Enviar correo de recuperación
      </ButtonSubmitUi>

      <Link
        href="/"
        className={style.volver}
      >
        Volver
      </Link>
    </FormUi>
    </ContainerUi>
    </div>
    </div>
  );
};

export default ForgotPasswordComponent;