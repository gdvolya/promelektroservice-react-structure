import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import "../styles/ReviewsPage.css";

const ReviewsPage = () => {
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (feedback.trim()) {
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

      <h1>Відгуки клієнтів</h1>
      <section className="reviews-list">
        <article className="review-item">
          <h2>Олександр</h2>
          <p>Чудова робота — швидко та професійно. Рекомендую всім!</p>
        </article>
        <article className="review-item">
          <h2>Марія</h2>
          <p>
            Монтаж освітлення зробили навіть раніше за термін. Дуже задоволена
            результатом.
          </p>
        </article>
      </section>

      <section className="review-form">
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
