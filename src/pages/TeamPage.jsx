import React from "react";
import { useTranslation } from "react-i18next";
import SeoHelmet from "../components/SeoHelmet";
import team1 from "../assets/team1.jpg";
import team2 from "../assets/team2.jpg";
import team3 from "../assets/team3.jpg";
import "../styles/TeamPage.css";

const teamMembers = [
  {
    name: "Олександр Іваненко",
    role: "Головний інженер",
    photo: team1,
    description: "15+ років досвіду в сфері електропостачання житлових та комерційних об'єктів."
  },
  {
    name: "Марина Петренко",
    role: "Менеджер проектів",
    photo: team2,
    description: "Організовує виконання проєктів з увагою до деталей і термінів."
  },
  {
    name: "Віктор Сидорчук",
    role: "Сервісний технік",
    photo: team3,
    description: "Забезпечує якість монтажу та технічну підтримку клієнтів."
  }
];

const TeamPage = () => {
  const { t } = useTranslation();

  return (
    <main className="team-page">
      <SeoHelmet
        title="Наша команда — Promelektroservice"
        description="Знайомтесь з нашими фахівцями, які забезпечують найвищу якість послуг."
        url="https://promelektroservice.com/team"
      />

      <section className="team-section">
        <h1>{t("team.title")}</h1>
        <p>{t("team.subtitle")}</p>

        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div className="team-card" key={index}>
              <img src={member.photo} alt={member.name} loading="lazy" />
              <h3>{member.name}</h3>
              <h4>{member.role}</h4>
              <p>{member.description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default TeamPage;
