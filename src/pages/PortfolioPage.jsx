// src/pages/PortfolioPage.jsx
import React from "react";
import MetaTags from "../components/MetaTags";


// Импорт изображений
import project1 from "../img/project1.webp";
import project1x2 from "../img/project1@2x.webp";
import project2 from "../img/project2.webp";
import project2x2 from "../img/project2@2x.webp";
import project3 from "../img/project3.webp";
import project3x2 from "../img/project3@2x.webp";
import project4 from "../img/project4.webp";
import project4x2 from "../img/project4@2x.webp";
import project5 from "../img/project5.webp";
import project5x2 from "../img/project5@2x.webp";
import project6 from "../img/project6.webp";
import project6x2 from "../img/project6@2x.webp";
import project7 from "../img/project7.webp";
import project7x2 from "../img/project7@2x.webp";

const projects = [
  { src: project1, src2x: project1x2, alt: "Проєкт 1" },
  { src: project2, src2x: project2x2, alt: "Проєкт 2" },
  { src: project3, src2x: project3x2, alt: "Проєкт 3" },
  { src: project4, src2x: project4x2, alt: "Проєкт 4" },
  { src: project5, src2x: project5x2, alt: "Проєкт 5" },
  { src: project6, src2x: project6x2, alt: "Проєкт 6" },
  { src: project7, src2x: project7x2, alt: "Проєкт 7" },
];

const PortfolioPage = () => {
  return (
    <>
  <MetaTags
    title="Портфоліо | ПромЕлектроСервіс"
    description="Дивіться приклади наших електромонтажних робіт"
    url="https://promelektroservice.vercel.app/portfolio"
    image="/img/project1.webp"
  />
  <main className="page-with-footer">
    ...
  </main>
</>
  );
};

export default PortfolioPage;
