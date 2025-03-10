import { usersTypes, loginTypes } from "@/types/usersTypes";

export const initialRegister: usersTypes = {
    name: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
};

export const initialLogin: loginTypes = {
    email: '',
    password: ''
};