import { Timestamp } from "firebase/firestore";

export type usersTypes = {
    name: string;
    lastName: string;
    email:string
    password: string;
    confirmPassword: string;
    image?: string;
    role: 'client' | 'admin';
};

export type dataUsersTypes = {
  uid: string;
  name: string;
  lastName: string;
  email: string;
  image?: string;
  createdAt: Timestamp;
  role: 'client' | 'admin';
};


export type loginTypes = {
    email:string
    password: string;
};


export type FormErrors = {
    [key in keyof usersTypes]?: string;
  };

  export type LoginErrors = {
    [key in keyof loginTypes]?: string;
  }