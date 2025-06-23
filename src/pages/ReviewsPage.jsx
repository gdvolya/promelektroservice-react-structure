import React from "react";
import { useTranslation } from "react-i18next";
import SeoHelmet from "../components/SeoHelmet";
import "../styles/ReviewsPage.css";

const ReviewsPage = () => {
  const { t } = useTranslation();

  return (
    <main className="reviews-page">
      <SeoHelmet
        title={t("reviews.meta.title")}
        description={t("reviews.meta.description")}
        url="https://promelektroservice.com/reviews"
      />

      <section className="reviews-section">
        <h1>{t("reviews.title")}</h1>
        <p>{t("reviews.subtitle")}</p>

        <div className="reviews-list">
          <div className="review">
            <p className="review-text">
              “{t("reviews.review1.text")}”
            </p>
            <p className="review-author">- {t("reviews.review1.author")}</p>
          </div>

          <div className="review">
            <p className="review-text">
              “{t("reviews.review2.text")}”
            </p>
            <p className="review-author">- {t("reviews.review2.author")}</p>
          </div>

          <div className="review">
            <p className="review-text">
              “{t("reviews.review3.text")}”
            </p>
            <p className="review-author">- {t("reviews.review3.author")}</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ReviewsPage;
