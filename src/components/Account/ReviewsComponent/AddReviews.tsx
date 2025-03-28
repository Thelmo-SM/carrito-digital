import { useState } from "react";
import { addReview } from "@/utils/firebase"; // Ajusta la ruta según tu estructura

const ReviewForm = ({ productId, userId }: { productId: string, userId: string }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addReview(productId, userId, rating, comment);
      setMessage("Reseña agregada correctamente.");
      setComment(""); // Limpiar el comentario después de enviarlo
    } catch (error: unknown) {
      setMessage("Error al agregar la reseña.");
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-md shadow-md">
      <h3 className="text-lg font-semibold">Dejar una reseña</h3>

      <label className="block mt-2">Calificación:</label>
      <select 
        value={rating} 
        onChange={(e) => setRating(Number(e.target.value))}
        className="p-2 border rounded-md"
      >
        {[1, 2, 3, 4, 5].map((num) => (
          <option key={num} value={num}>
            {num} ⭐
          </option>
        ))}
      </select>

      <label className="block mt-2">Comentario:</label>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
        className="w-full p-2 border rounded-md"
        required
      ></textarea>

      <button 
        type="submit" 
        disabled={loading} 
        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md"
      >
        {loading ? "Enviando..." : "Enviar Reseña"}
      </button>

      {message && <p className="mt-2 text-sm">{message}</p>}
    </form>
  );
};

export default ReviewForm;