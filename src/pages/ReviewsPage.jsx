import React, { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import AOS from "aos";
import "aos/dist/aos.css";
import "../styles/ReviewsPage.css";
// Импортируем нашу базу данных из существующего файла
import { db } from "../firebase";
import { collection, getDocs, addDoc, serverTimestamp, query, orderBy } from "firebase/firestore";

const ReviewsPage = () => {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState([]);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitError, setSubmitError] = useState(null);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    const reviewsCollectionRef = collection(db, "reviews");
    const q = query(reviewsCollectionRef, orderBy("createdAt", "desc"));
    
    try {
      const querySnapshot = await getDocs(q);
      const fetchedReviews = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReviews(fetchedReviews);
    } catch (error) {
      console.error("Ошибка при получении отзывов:", error);
      setSubmitError("Не удалось загрузить отзывы. Попробуйте обновить страницу.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    AOS.init({ once: true, duration: 600 });
    fetchReviews();
  }, [fetchReviews]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(false);
    setSubmitError(null);

    if (!feedback.trim()) {
      setSubmitError("Пожалуйста, напишите что-нибудь, чтобы отправить отзыв.");
      return;
    }

    try {
      await addDoc(collection(db, "reviews"), {
        name: userName || "Аноним",
        email: userEmail,
        content: feedback,
        createdAt: serverTimestamp(),
      });
      setSubmitted(true);
      setUserName("");
      setUserEmail("");
      setFeedback("");
      fetchReviews();
    } catch (error) {
      console.error("Ошибка при отправке отзыва:", error);
      setSubmitError("Не удалось отправить отзыв. Попробуйте еще раз.");
    }
  };

  return (
    <main className="reviews-page">
      <Helmet>
        <title>{t("meta.reviewsTitle")}</title>
        <meta name="description" content={t("meta.reviewsDescription")} />
      </Helmet>

      <h1 data-aos="fade-up">{t("reviews.title")}</h1>

      {loading ? (
        <div className="loading-spinner">{t("loading")}</div>
      ) : (
        <section className="reviews-list" data-aos="fade-up">
          <h2>{t("reviews.listTitle")}</h2>
          {reviews.length > 0 ? reviews.map((review) => (
            <div key={review.id} className="review-item">
              <div className="review-content">“{review.content}”</div>
              <div className="review-author">— {review.name}</div>
            </div>
          )) : (
            <p className="no-reviews-message">Наразі відгуків немає. Будьте першим!</p>
          )}
          {submitError && <p className="error-msg">{submitError}</p>}
        </section>
      )}

      <section className="review-form" data-aos="fade-up" data-aos-delay="300">
        <h2>{t("reviews.leaveReview")}</h2>
        <p>{t("reviews.formDescription")}</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder={t("reviews.namePlaceholder")}
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <input
            type="email"
            placeholder={t("reviews.emailPlaceholder")}
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
          />
          <textarea
            placeholder={t("reviews.messagePlaceholder")}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            required
          />
          <button className="submit-btn" type="submit" disabled={!feedback.trim()}>
            {t("reviews.submit")}
          </button>
          {submitted && (
            <p className="success-msg">{t("reviews.thanks")}</p>
          )}
        </form>
      </section>
    </main>
  );
};

export default ReviewsPage;