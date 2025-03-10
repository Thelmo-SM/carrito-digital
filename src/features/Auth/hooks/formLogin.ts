import { loginTypes, LoginErrors } from "@/types/usersTypes";
import { useCallback, useState } from "react";
import { loginService } from "../services/loginService";



 export const useLogin = (initialValue: loginTypes, validateForm: (values: loginTypes) => LoginErrors) => {
    const [form, setForm] = useState(initialValue);
    const [errors, setErrors] = useState<LoginErrors>({})

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
        try {
          const data = await loginService(form);
          console.log('Inicio de sesión exitoso: ', data);
        } catch (error: unknown) {
          console.log('Error en el hook: ', error);
        }
    }



    return {
        form,
        errors,
        handleChange,
        handleSubmit,
        handleBlur
    };
};