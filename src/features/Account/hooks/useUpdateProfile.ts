import { useCallback, useEffect, useState } from "react";
import { useAuthUsers } from "@/features/Auth/hooks/authUsers";
import { usersTypes } from "@/types/usersTypes";
import { updateUserProfile } from "../services/userAccountServices";
import { validateUserProfile, ValidationErrors } from "../helpers/validateProfileValues";

type SimpleAddress = Omit<usersTypes, "uid" | "createdAt" | "role"> & {
  image: string;
};
interface UpdateProfileProps {
  closeModal: () => void;
  onSuccess: (message: string) => void;
}

  export type ProfileErrors = {
    [key in keyof ValidationErrors]?: string;
  }

export const useUpdateProfile = ({ closeModal, onSuccess }: UpdateProfileProps) => {
  const user = useAuthUsers();
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<ProfileErrors>({});
  const [form, setForm] = useState<SimpleAddress>({
    name: user?.name || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    image: user?.image || "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        image: user.image || "",
        password: "",
        confirmPassword: "",
      });

      if (user.image) {
        setImagePreview(user.image);
      }
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      const { name, value } = e.target as { name: keyof ValidationErrors; value: string };
  
      const fieldErrors = validateUserProfile({ ...form, [name]: value });
  
      if (fieldErrors[name]) {
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          [name]: fieldErrors[name]!,
        }));
      } else {
        setFormErrors((prevErrors) => {
          // Omitimos la clave sin asignarla a una variable (truco limpio)
          const rest = Object.fromEntries(
            Object.entries(prevErrors).filter(([key]) => key !== name)
          ) as ProfileErrors;
  
          return rest;
        });
      }
    },
    [form]
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let image = form.image;

    const errors = validateUserProfile(form);

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setLoading(false);
      return;
    }

    if (file) {
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      if (!uploadPreset) {
        console.error("El upload preset no está definido en las variables de entorno");
        return;
      }

      try {
        const formData = new FormData();
        formData.append("image", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (response.ok) {
          image = data.secure_url;
        } else {
          console.error('Error al subir la imagen:', data.message);
          return;
        }
      } catch (error) {
        console.error("Error al subir la imagen:", error);
        return;
      }
    }

    const updatedUserData = {
      ...form,
      image,
      password: form.password && form.password.trim() !== "" ? form.password : undefined,
    };
    
    if (updatedUserData.password === undefined) {
      delete updatedUserData.password;
    }
  
    try {
      await updateUserProfile(user?.uid, updatedUserData);
      console.log("Perfil actualizado correctamente");
    
      onSuccess("✅ Perfil actualizado correctamente.");
    
      setTimeout(() => {
        closeModal();
      }, 1000);
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    imagePreview,
    file,
    loading,
    formErrors,
    handleBlur,
    handleChange,
    handleFileChange,
    handleSubmit,
  };
};
