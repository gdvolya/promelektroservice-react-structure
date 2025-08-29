import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import AOS from "aos";
import "aos/dist/aos.css";
import "../styles/ReviewsPage.css";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";

const ReviewsPage = () => {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState([]);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({ once: true, duration: 600 });

    const fetchReviews = async () => {
      setLoading(true);
      const reviewsCollectionRef = collection(db, "reviews");
      const q = query(reviewsCollectionRef, orderBy("createdAt", "desc"));

      try {
        const querySnapshot = await getDocs(q);
        const fetchedReviews = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReviews(fetchedReviews);
      } catch (error) {
        console.error("Ошибка при получении отзывов: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (feedback.trim()) {
      try {
        const reviewsCollectionRef = collection(db, "reviews");
        const docRef = await addDoc(reviewsCollectionRef, {
          name: userName || t("reviews.anonymous"),
          email: userEmail || "",
          content: feedback.trim(),
          createdAt: serverTimestamp(),
        });

        const newReview = {
          id: docRef.id,
          name: userName || t("reviews.anonymous"),
          email: userEmail || "",
          content: feedback.trim(),
          createdAt: new Date(),
        };
        setReviews((prev) => [newReview, ...prev]);

        setSubmitted(true);
        setUserName("");
        setUserEmail("");
        setFeedback("");
        setTimeout(() => setSubmitted(false), 3000);
      } catch (error) {
        console.error("Ошибка при добавлении отзыва: ", error);
      }
    }
  };

  return (
    <main className="reviews-page">
      <Helmet>
        <title>{t("meta.reviewsTitle")}</title>
        <meta name="description" content={t("meta.reviewsDescription")} />
      </Helmet>

      <h1 data-aos="fade-up">{t("reviews.heading")}</h1>

      {loading ? (
        <p className="loading-message">Завантаження відгуків...</p>
      ) : (
        <section className="reviews-grid">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div className="review-card" key={review.id} data-aos="fade-up">
                <div className="review-content">“{review.content}”</div>
                <div className="review-author">— {review.name}</div>
              </div>
            ))
          ) : (
            <p className="no-reviews-message">
              Наразі відгуків немає. Будьте першим!
            </p>
          )}
        </section>
      )}

      <section
        className="review-form"
        data-aos="fade-up"
        data-aos-delay="300"
      >
        <h2>{t("reviews.leaveReview")}</h2>
        <p>{t("reviews.formDescription")}</p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="reviewName" className="visually-hidden">
            {t("reviews.namePlaceholder")}
          </label>
          <input
            type="text"
            id="reviewName"
            name="reviewName"
            placeholder={t("reviews.namePlaceholder")}
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            autoComplete="name"
            required
          />

          <label htmlFor="reviewEmail" className="visually-hidden">
            {t("reviews.emailPlaceholder")}
          </label>
          <input
            type="email"
            id="reviewEmail"
            name="reviewEmail"
            placeholder={t("reviews.emailPlaceholder")}
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            autoComplete="email"
            required
          />

          <label htmlFor="reviewMessage" className="visually-hidden">
            {t("reviews.messagePlaceholder")}
          </label>
          <textarea
            id="reviewMessage"
            name="reviewMessage"
            placeholder={t("reviews.messagePlaceholder")}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows="5"
            required
          ></textarea>

          <button
            className="submit-btn"
            type="submit"
            disabled={!feedback.trim()}
          >
            {t("reviews.submit")}
          </button>
          {submitted && <p className="success-msg">{t("reviews.thanks")}</p>}
        </form>
      </section>
    </main>
  );
};

export default ReviewsPage;
