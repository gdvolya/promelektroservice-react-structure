import React from "react";
import { Helmet } from "react-helmet-async";
import "../styles/ReviewsPage.css";

const ReviewsPage = () => {
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
          <p>Монтаж освітлення зробили навіть раніше за термін. Дуже задоволена результатом.</p>
        </article>
      </section>

      <section className="review-form">
        <h2>Залишити відгук</h2>
        <form>
          <textarea placeholder="Напишіть свій відгук..." required></textarea>
          <button className="submit-btn" type="submit">Надіслати</button>
        </form>
      </section>
    </main>
  );
};

export default ReviewsPage;
