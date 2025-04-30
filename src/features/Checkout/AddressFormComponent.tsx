'use client';


import { useState } from "react";
import { useAuthUsers } from "@/features/Auth/hooks/authUsers";
import { saveShippingAddress } from "./services/addressServices";
import { ShippingAddress } from "@/types/ordersTypes";
import style from '../../styles/producForm.module.css'
import { FormUi } from "@/components/UI";

interface AddressFormComponentProps {
    onAddressSaved: (address: ShippingAddress) => void;
  }

export const AddressFormComponent = ({ onAddressSaved }: AddressFormComponentProps) => {
    const user = useAuthUsers();
    const [address, setAddress] = useState({
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAddress((prevAddress) => ({
            ...prevAddress,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user?.uid) {
            alert("Por favor, inicie sesión para agregar una dirección.");
            return;
        }

        // Guardar la dirección en la base de datos
        try {
            await saveShippingAddress(user.uid, address);
            onAddressSaved(address);
            console.log('Dirreccion ceada correctamente.')
        } catch (error) {
            alert("Hubo un error al guardar la dirección.");
            console.log(error)
        }
    };

    return (
        <div className={style.formAddress}>
        <FormUi onSubmit={handleSubmit}>
            <h3>Dirección de Envío</h3>
            <div>
                <label>Calle:</label>
                <input
                    type="text"
                    name="street"
                    value={address.street}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Ciudad:</label>
                <input
                    type="text"
                    name="city"
                    value={address.city}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Estado:</label>
                <input
                    type="text"
                    name="state"
                    value={address.state}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Código Postal:</label>
                <input
                    type="text"
                    name="postalCode"
                    value={address.postalCode}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>País:</label>
                <input
                    type="text"
                    name="country"
                    value={address.country}
                    onChange={handleChange}
                    required
                />
            </div>
            <button type="submit">Guardar Dirección</button>
        </FormUi>
        </div>
    );
};

export default AddressFormComponent;
