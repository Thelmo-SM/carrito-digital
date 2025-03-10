import { auth } from '@/utils/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export const loginService = async (user: {email:string, password:string}) => {
    try {
        return await signInWithEmailAndPassword(auth, user.email, user.password);
    } catch (error: unknown) {
        console.log('Error al iniciar sesión. Error del servicio: ', error);
    }
}