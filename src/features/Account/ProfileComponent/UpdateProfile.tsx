"use client";

import { 
    FormUi,
    LabelUi,
    InputUi,
    ButtonSubmitUi,
    ContainerUi,
    DivForm,
    ImagePreview
} from "@/components/UI";
import { useUpdateProfile } from "../hooks/useUpdateProfile";
import { LoaderUi } from "@/components/UI/LoaderUi";

interface UpdateProfileProps {
    closeModal: () => void;
    onSuccess: (message: string) => void; 
}

export const UpdateProfile: React.FC<UpdateProfileProps>  = ({closeModal, onSuccess}) => {
    const {
        form,
        loading,
        handleChange,
        handleFileChange,
        handleSubmit,
        imagePreview
    } = useUpdateProfile({closeModal, onSuccess});

    // Si no hay usuario, mostrar un mensaje de carga o retorno temprano
    if (!form.name) {
        return <p>Cargando...</p>;
    }

    return (
        <ContainerUi>
            <FormUi onSubmit={handleSubmit}>
                <h2>Editar perfil</h2>

                <DivForm>
                    <LabelUi>Imagen</LabelUi>
                    <InputUi 
                        type="file" 
                        name="image" 
                        onChange={handleFileChange} 
                    />
                    <DivForm>
                      {loading ? (
                          <LoaderUi />  // Mostrar un mensaje mientras la imagen se está subiendo
                         ) : (
                           imagePreview && <ImagePreview src={imagePreview} width={200} height={200} alt="Vista previa" />
                         )}
                         </DivForm>
                </DivForm>

                <DivForm>
                    <LabelUi>Nombre</LabelUi>
                    <InputUi 
                        type="text" 
                        name="name" 
                        value={form.name} 
                        onChange={handleChange} 
                    />
                </DivForm>

                <DivForm>
                    <LabelUi>Apellido</LabelUi>
                    <InputUi 
                        type="text" 
                        name="lastName" 
                        value={form.lastName} 
                        onChange={handleChange} 
                    />
                </DivForm>

                <DivForm>
                    <LabelUi>Correo electrónico</LabelUi>
                    <InputUi 
                        type="email" 
                        name="email" 
                        value={form.email} 
                        onChange={handleChange} 
                    />
                </DivForm>

                <DivForm>
                    <LabelUi>Cambiar contraseña</LabelUi>
                    <InputUi 
                        type="password" 
                        name="password" 
                        value={form.password} 
                        onChange={handleChange} 
                    />
                </DivForm>

                <DivForm>
                    <LabelUi>Confirmar tu nueva contraseña</LabelUi>
                    <InputUi 
                        type="password" 
                        name="confirmPassword" 
                        value={form.confirmPassword} 
                        onChange={handleChange} 
                    />
                </DivForm>

                <ButtonSubmitUi>
                    {loading ? <LoaderUi /> : 'Terminar'}
                    </ButtonSubmitUi>
            </FormUi>
        </ContainerUi>
    );
};

export default UpdateProfile;