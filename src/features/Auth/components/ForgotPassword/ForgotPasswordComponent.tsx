'use client';

//import { usersTypes } from "@/types/usersTypes";
import { sendResetEmail } from "../../services/sendResetEmailService";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import style from '@/styles/form.module.css';
import { ContainerUi, FormUi, DivForm, LabelUi, ButtonSubmitUi, InputUi } from "@/components/UI";

export const ForgotPasswordComponent = () => {
  const [inputValue, setInputValue] = useState("");
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // 🔹 Importante para evitar recarga de página

    if (!inputValue) {
      console.log("Por favor, ingresa un correo electrónico.");
      return;
    }

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
      onSubmit={onSubmit} // 🔹 Aquí ahora se pasa la función correctamente
      >
      <p className={style.textForgot}>Te enviaremos un correo electrónico para que puedas recuperar tu contraseña</p>
      <DivForm>
        <LabelUi htmlFor="email">
          Correo electrónico
        </LabelUi>
        <InputUi
          type="email"
          id="email"
          name="email"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          required
        />
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