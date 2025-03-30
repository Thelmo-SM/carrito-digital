import { useState } from "react";
import { addReview } from "@/utils/firebase"; // Ajusta la ruta según tu estructura
import style from '@/styles/account.module.css';

const ReviewForm = ({ productId, userId }: { productId: string, userId: string }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!userId || !productId) {
      setMessage("❌ Error: Usuario o producto no definidos.");
      console.error("Error: userId o productId están indefinidos", { userId, productId });
      return;
    }
  
    if (!comment.trim()) {
      setMessage("❌ Escribe un comentario antes de enviar.");
      return;
    }
  
    setLoading(true);
  
    try {
      await addReview({ userId, productId, rating, comment });
      setMessage("✅ Reseña agregada correctamente.");
      setComment(""); // Limpiar el comentario después de enviarlo
    } catch (error) {
      setMessage("❌ Error al agregar la reseña.");
      console.error("Error al enviar la reseña:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={style.addReviewContainer}>
      <h3>Dejar una reseña</h3>
    <form onSubmit={handleSubmit} className={style.addReview}>
      <div className={style.review}>
      <label>Calificación:</label>
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
      <div className={style.coment}>
      <label>Comentario:</label>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
        required
      ></textarea>
        <button 
        type="submit" 
        disabled={loading} 
        className={style.button}
      >
        {loading ? "Enviando..." : "Enviar Reseña"}
      </button>
      </div>
      </div>

      {message && <p className={style.massage}>{message}</p>}
    </form>
    </div>
  );
};

export default ReviewForm;