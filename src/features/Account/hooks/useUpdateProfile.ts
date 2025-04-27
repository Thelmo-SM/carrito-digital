import { useEffect, useState } from "react";
import { useAuthUsers } from "@/features/Auth/hooks/authUsers";
import { usersTypes } from "@/types/usersTypes";
//import { updateUser } from "@/features/Auth/services/registerService";
//import { updateUserProfile } from "@/utils/firebase";
import { updateUserProfile } from "../services/userAccountServices";

type SimpleAddress = Omit<usersTypes, "uid" | "createdAt" | "role"> & {
  image: string;
};
interface UpdateProfileProps {
  closeModal: () => void;
  onSuccess: (message: string) => void;
}

export const useUpdateProfile = ({ closeModal, onSuccess }: UpdateProfileProps) => {
  const user = useAuthUsers(); // Obtener los datos del usuario
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
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

      // Si el usuario tiene una imagen, establecerla en la vista previa
      if (user.image) {
        setImagePreview(user.image);
      }
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);

      // Crear una URL temporal para la vista previa
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string); // Guardar la vista previa
      };
      reader.readAsDataURL(selectedFile); // Lee el archivo como una URL de datos
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let image = form.image;

    // Subir la imagen a Cloudinary si se ha seleccionado una nueva imagen
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
      image, // Solo se incluye la nueva imagen si fue subida
      // Incluye password solo si tiene valor
      password: form.password && form.password.trim() !== "" ? form.password : undefined,
    };
    
    // Eliminar el campo password si no se ha actualizado
    if (updatedUserData.password === undefined) {
      delete updatedUserData.password;
    }
  
    try {
      await updateUserProfile(user?.uid, updatedUserData);
      console.log("Perfil actualizado correctamente");
    
      // Primero mostramos el mensaje de éxito
      onSuccess("✅ Perfil actualizado correctamente.");
    
      // Luego cerramos el modal
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
    handleChange,
    handleFileChange,
    handleSubmit,
  };
};
