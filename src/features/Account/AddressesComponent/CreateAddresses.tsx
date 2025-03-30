'use client';

import { ShippingAddress } from "@/types/ordersTypes";
import { LabelUi, ButtonSubmitUi, InputUi, DivForm, FormUi, ContainerUi } from "@/components/UI";
import { validateAddressForm } from "./validateAddressForm";
import { useCreateAddress } from "../hooks/useCreateAddress";
import { ValidateMessgeErrror } from "@/components/UI/Message";

type SimpleAddress = Omit<ShippingAddress, "id" | "isDefault">;

const initialValue: SimpleAddress = {
  street: '',
  city: '',
  state: '',
  postalCode: '',
  country: '',
}

export const CreateAddresses = () => {
  const {
    form,
    errors,
    handleBlur,
    handleChange,
    handleSubmit
  } = useCreateAddress(initialValue, validateAddressForm);
  
  const isFormValid = Object.values(form).every(value => value !== '') && Object.keys(errors).length === 0;


  return (
    <ContainerUi>
      <h2>Agregar nueva dirrección</h2>
      <FormUi onSubmit={handleSubmit}>
        <DivForm>
          <LabelUi>Calle:</LabelUi>
          <InputUi type="text" 
          name="street"
          value={form.street} 
          onBlur={handleBlur}
          onChange={handleChange} required />
          {errors.street && <ValidateMessgeErrror>
            {errors.street}
            </ValidateMessgeErrror>}
        </DivForm>
        <DivForm>
          <LabelUi>Ciudad:</LabelUi>
          <InputUi type="text" 
          name="city"
          value={form.city} 
          onBlur={handleBlur}
          onChange={handleChange} required />
          {errors.city && <ValidateMessgeErrror>
            {errors.city}
            </ValidateMessgeErrror>}
        </DivForm>
        <DivForm>
          <LabelUi>Estado:</LabelUi>
          <InputUi type="text" 
          name="state"
          value={form.state} 
          onBlur={handleBlur}
          onChange={handleChange} required />
          {errors.state && <ValidateMessgeErrror>
            {errors.state}
            </ValidateMessgeErrror>}
        </DivForm>
        <DivForm>
          <LabelUi>Código Postal:</LabelUi>
          <InputUi type="text" 
          name="postalCode"
          value={form.postalCode} 
          onBlur={handleBlur}
          onChange={handleChange} required />
          {errors.postalCode && <ValidateMessgeErrror>
            {errors.postalCode}
            </ValidateMessgeErrror>}
        </DivForm>
        <DivForm>
          <LabelUi>País:</LabelUi>
          <InputUi type="text" 
          name="country"
          value={form.country} 
          onBlur={handleBlur}
          onChange={handleChange} required />
          {errors.country && <ValidateMessgeErrror>
            {errors.country}
            </ValidateMessgeErrror>}
        </DivForm>
        <ButtonSubmitUi type="submit"
        disabled={!isFormValid}
        >Crear Dirección</ButtonSubmitUi>
      </FormUi>
    </ContainerUi>
  );
};

export default CreateAddresses;
