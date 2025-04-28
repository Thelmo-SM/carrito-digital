export const verifyTokenAPI = async (token: string) => {
  try {
    const res = await fetch('/api/verify-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    if (!res.ok) {
      console.error('Error: El servidor respondió con un error:', res.status);
      return false;
    }

    // Verifica si el contenido de la respuesta es válido
    const data = await res.text();
    
    // Intenta analizar el JSON solo si la respuesta tiene contenido
    let parsedData;
    try {
      parsedData = JSON.parse(data);
    } catch (e) {
      console.error('Error al analizar el JSON:', e);
      return false;
    }

    if (parsedData.success) {
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
