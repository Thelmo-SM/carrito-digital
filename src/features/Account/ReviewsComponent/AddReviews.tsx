import { useState } from "react";
import { addReviewToProduct } from "../services/reviewsServices";
import style from '@/styles/account.module.css';
import { ValidateMessgeErrror } from "@/components/UI/Message";
import { Timestamp } from "firebase/firestore";

const ReviewForm = ({ productId, userId }: { productId: string, userId: string }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{ comment?: string }>({});

  const validateForm = () => {
    const newErrors: { comment?: string } = {};
    
    if (!comment.trim()) {
      newErrors.comment = "❌ El comentario no puede estar vacío.";
    } else if (comment.trim().length < 5) {
      newErrors.comment = "❌ El comentario debe tener al menos 5 caracteres.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId || !productId) {
      console.error("Error: userId o productId están indefinidos", { userId, productId });
      return;
    }

    // Validar el formulario antes de continuar
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const reviewData = {
        userId,
        rating,
        comment,
        orderId: "orderIdHere", // Aquí debes obtener el orderId correspondiente
        createdAt: new Date(Timestamp.now().toMillis()), // Convertir Timestamp a Date
      };

      await addReviewToProduct(productId, reviewData);
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
            ></textarea>
            {errors.comment && <ValidateMessgeErrror>{errors.comment}</ValidateMessgeErrror>}
            {message && <p>{message}</p>}

            <button
              type="submit"
              className={style.button}
            >
              {loading ? "Enviando..." : "Enviar Reseña"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
