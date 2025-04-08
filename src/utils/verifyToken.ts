//import Cookies from 'js-cookie';

export const verifyTokenAPI = async (token: string) => {
  try {
    const res = await fetch('/api/verify-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    const data = await res.json();
    return data.success; // Retorna true si el token es válido, de lo contrario false
  } catch (error) {
    console.error('Error al verificar el token:', error);
    return false;
  }
};
