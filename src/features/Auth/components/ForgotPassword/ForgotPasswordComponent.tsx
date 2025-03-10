'use client';

//import { usersTypes } from "@/types/usersTypes";
import { sendResetEmail } from "@/utils/firebase";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

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
      router.push("/");
    } catch (error) {
      console.error("Error al intentar enviar el correo: ", error);
    }
  };

  return (
    <form
      style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}
      onSubmit={onSubmit} // 🔹 Aquí ahora se pasa la función correctamente
    >
      <div>
        <label htmlFor="email" style={{ display: "block", fontWeight: "bold" }}>
          Correo electrónico
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            margin: "8px 0",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
          required
        />
      </div>

      <button
        type="submit"
        style={{
          width: "100%",
          padding: "10px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Enviar correo de recuperación
      </button>

      <Link
        href="/"
        style={{
          display: "block",
          textAlign: "center",
          marginTop: "10px",
          color: "#007bff",
          textDecoration: "none",
        }}
      >
        Volver
      </Link>
    </form>
  );
};

export default ForgotPasswordComponent;