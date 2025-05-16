import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      const querySnapshot = await getDocs(collection(db, "reviews"));
      const reviewsData = querySnapshot.docs.map(doc => doc.data());
      setReviews(reviewsData);
    };
    fetchReviews();
  }, []);

  const handleSubmit = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (inputValue.trim() && name.trim() && email.trim() && emailRegex.test(email)) {
      const newReview = { text: inputValue.trim(), name, email };
      await addDoc(collection(db, "reviews"), newReview);
      setReviews(prev => [...prev, newReview]);
      setInputValue("");
      setName("");
      setEmail("");
    } else {
      alert("Будь ласка, заповніть всі поля коректно.");
    }
  };

  return (
    <main className="page-with-footer">
      <section id="reviews">
        <h2>Відгуки клієнтів</h2>
        <input type="text" placeholder="Ваше ім’я" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="email" placeholder="Ваш email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <textarea
          placeholder="Напишіть свій відгук..."
          className="review-textarea"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        ></textarea>
        <div style={{ textAlign: "center" }}>
          <button className="btn" onClick={handleSubmit}>Надіслати</button>
        </div>
        <div className="reviews-list">
          {reviews.map((review, index) => (
            <div key={index} className="review-item">
              <p><strong>{review.name}</strong> ({review.email})</p>
              <p>{review.text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default ReviewsPage;
