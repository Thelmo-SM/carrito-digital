
import { 
    FormUi,
     LabelUi,
     InputUi,
     ButtonSubmitUi,
     ContainerUi,
     DivForm
 } from "@/components/UI"


export const UpdateProfile = () => {

    const submit = () => {
        console.log('editar perfil');
    }
    
    return (
        <ContainerUi>
            <FormUi onSubmit={submit}>
                <h2>Editar perfil</h2>
                <DivForm>
                    <LabelUi>Imagen</LabelUi>
                    <InputUi />
                </DivForm>
                <DivForm>
                    <LabelUi>Nombre</LabelUi>
                    <InputUi />
                </DivForm>
                <DivForm>
                    <LabelUi>Apellido</LabelUi>
                    <InputUi />
                </DivForm>
                <DivForm>
                    <LabelUi>Correo electrónico</LabelUi>
                    <InputUi />
                </DivForm>
                <DivForm>
                    <LabelUi>Cambiar contraseña</LabelUi>
                    <InputUi />
                </DivForm>
                <DivForm>
                    <LabelUi>Confirmar tu nueva contraseña</LabelUi>
                    <InputUi />
                </DivForm>
                <ButtonSubmitUi>Terminar</ButtonSubmitUi>
            </FormUi>
        </ContainerUi>
    );
};

export default UpdateProfile;