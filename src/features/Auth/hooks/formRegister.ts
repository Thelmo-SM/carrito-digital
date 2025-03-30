import { usersTypes, FormErrors, dataUsersTypes } from "@/types/usersTypes";
import { useCallback, useState } from "react";
import { registerService } from "../services/registerService";
import { setDocument } from "@/utils/firebase";



 export const useRegister = (initialValue: usersTypes, validateForm: (values: usersTypes) => FormErrors) => {
    const [form, setForm] = useState(initialValue);
    const [errors, setErrors] = useState<FormErrors>({})
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;

        setForm((capture) => ({
            ...capture,
            [name]:value,
        }))
        console.log('Datos del formulario:', value);
    };

    const handleBlur = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
          const { name, value } = e.target as { name: keyof usersTypes; value: string };
    
          setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: validateForm({ ...form, [name]: value })[name],
          }));
        },
        [form, validateForm]
      );

      const userColection = async (user: dataUsersTypes) => {

        const path = `users/${user.uid}`;
  
        try {
          await setDocument(path, user)
        } catch (error: unknown) {
          console.log('Error en la coleccion de usuario ubicado en el hook: ', error);
        }
      }

      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);
        try {
          const createdUser = await registerService(form);
      
          if (!createdUser || !createdUser.uid) {
            throw new Error("Error: UID no encontrado en el usuario creado.");
          }
      
          console.log("Usuario autenticado:", createdUser);
      
          const { password, confirmPassword, ...noPassword } = form;
          console.log(password, confirmPassword)
      
          await userColection({ ...noPassword, uid: createdUser.uid } as dataUsersTypes);
        } catch (error: unknown) {
          console.error("Error en el hook de registro:", error);
        } finally {
          setLoading(false);
          setSuccess(true);
        }
      };
    

    return {
        form,
        errors,
        loading,
        success,
        handleChange,
        handleSubmit,
        handleBlur
    };
};