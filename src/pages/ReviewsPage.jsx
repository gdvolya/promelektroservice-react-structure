import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
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
        { name: "Анонім", content: feedback.trim() },
      ]);
      setSubmitted(true);
      setFeedback("");
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <main className="reviews-page">
      <Helmet>
        <title>Відгуки — Promelektroservice</title>
        <meta
          name="description"
          content="Відгуки наших клієнтів про електромонтажні роботи."
        />
      </Helmet>

      <h1 data-aos="fade-up">Відгуки клієнтів</h1>
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
        <h2>Залишити відгук</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            placeholder="Напишіть свій відгук..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            required
          />
          <button className="submit-btn" type="submit">
            Надіслати
          </button>
          {submitted && (
            <p className="success-msg">✅ Дякуємо за ваш відгук!</p>
          )}
        </form>
      </section>
    </main>
  );
};

export default ReviewsPage;
