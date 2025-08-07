import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next"; // Импортируем useTranslation
import AOS from "aos";
import "aos/dist/aos.css";
import "../styles/ReviewsPage.css";

const initialReviews = [
  {
    name: "Олександр",
    content: "Чудова робота — швидко та професійно. Рекомендую всім!",
  },
  {
    name: "Марія",
    content:
      "Монтаж освітлення зробили навіть раніше за термін. Дуже задоволена результатом.",
  },
];

const ReviewsPage = () => {
  const { t } = useTranslation(); // Используем hook для перевода
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [reviews, setReviews] = useState(initialReviews);

  useEffect(() => {
    AOS.init({ once: true, duration: 600 });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (feedback.trim()) {
      setReviews((prev) => [
        ...prev,
        { name: t("reviews.anonymous"), content: feedback.trim() }, // Переводим имя
      ]);
      setSubmitted(true);
      setFeedback("");
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <main className="reviews-page">
      <Helmet>
        <title>{t("meta.reviewsTitle")}</title> {/* Переводим title */}
        <meta
          name="description"
          content={t("meta.reviewsDescription")} // Переводим description
        />
      </Helmet>

      <h1 data-aos="fade-up">{t("reviews.heading")}</h1> {/* Переводим заголовок */}
      <section className="reviews-grid">
        {reviews.map((review, idx) => (
          <div
            className="review-card"
            key={idx}
            data-aos="fade-up"
            data-aos-delay={idx * 100}
          >
            <div className="review-content">“{review.content}”</div>
            <div className="review-author">— {review.name}</div>
          </div>
        ))}
      </section>

      <section className="review-form" data-aos="fade-up" data-aos-delay="300">
        <h2>{t("reviews.leaveReview")}</h2> {/* Переводим заголовок формы */}
        <form onSubmit={handleSubmit}>
          <textarea
            placeholder={t("reviews.placeholder")} // Переводим placeholder
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            required
          />
          <button className="submit-btn" type="submit">
            {t("reviews.submit")} {/* Переводим кнопку */}
          </button>
          {submitted && (
            <p className="success-msg">{t("reviews.thanks")}</p> // Переводим сообщение об успехе
          )}
        </form>
      </section>
    </main>
  );
};

export default ReviewsPage;
