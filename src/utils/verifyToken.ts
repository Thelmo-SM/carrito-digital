export const verifyTokenAPI = async (token: string) => {
  try {
    const res = await fetch('/api/verify-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    // Verifica si la respuesta fue exitosa
    if (!res.ok) {
      console.error('Error: El servidor respondió con un error:', res.status);
      return false;
    }

    const data = await res.json();

    if (data.success) {
      return true; // Token válido
    } else {
      console.error('Error: Token inválido o no encontrado.');
      return false; // Token inválido
    }
  } catch (error) {
    console.error('Error al verificar el token:', error);
    return false; // Si hubo un error en la solicitud o en el servidor
  }
};
