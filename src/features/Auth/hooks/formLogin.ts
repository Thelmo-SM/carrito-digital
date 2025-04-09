import { loginTypes, LoginErrors } from "@/types/usersTypes";
import { useCallback, useState } from "react";
import { loginService } from "../services/loginService";
import { FirebaseError } from "firebase/app";
import { useRouter } from "next/navigation";



 export const useLogin = (initialValue: loginTypes, validateForm: (values: loginTypes) => LoginErrors) => {
    const [form, setForm] = useState(initialValue);
    const [errors, setErrors] = useState<LoginErrors>({})
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const router = useRouter();

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;

        setForm((capture) => ({
            ...capture,
            [name]:value,
        }));
    };

    const handleBlur = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
          const { name, value } = e.target as { name: keyof LoginErrors; value: string };
    
          setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: validateForm({ ...form, [name]: value })[name],
          }));
        },
        [form, validateForm]
      );

    const handleSubmit = async (e:React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);
        try {
          const data = await loginService(form);
          if(!data.success) {
            setErrorMessage(data.message ?? null);
            setTimeout(() => setErrorMessage(null), 2500);
            setSuccess(false);
          } else {
            setSuccess(true);
            router.push('/products');
          }
          console.log('Mensaje en la consola: ', data);
        } catch (error: unknown) {
          if (error instanceof FirebaseError) {
            console.error("Error de Firebase:", error.message);
            setErrorMessage("Hubo un error al iniciar sesión. Intenta de nuevo.");
          } else {
            console.error("Error desconocido:", error);
            setErrorMessage("Ocurrió un error inesperado.");
          }
        } finally {
          setLoading(false);
          
        }
    }



    return {
        form,
        errors,
        loading,
        success,
        errorMessage,
        handleChange,
        handleSubmit,
        handleBlur
    };
};