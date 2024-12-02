import React from "react";
import { useNavigate } from "react-router-dom";
import anne_frank from "../images/anne_frank.jpg";
import janusz_korczak from "../images/janusz_korczak.png";

export default function WW2() {
  const navigate = useNavigate();

  const profiles = [
    { id: 1, name: "Anne Frank", description: "Anne Frank, born in Frankfurt, Germany, in 1929, was a Jewish girl who gained worldwide recognition through her diary. During WW2, her family went into hiding in Amsterdam's 'secret annex' to escape Nazi persecution. Her diary,, 'The Diary of a Young Girl', provides an account of life under Nazi occupation. She and her sister Margot were arrested in 1944 and later tried at the Bergen-Belsen concentration camp.", image: anne_frank },
    { id: 2, name: "Janusz Korczak", description: "Janusz Korzak was a compassionate Polish-Jewish educator, peditrician and children's author whose unwavering dedication to the welfare of the children left a mark on History. He ran an orphange in the Warsaw Ghetto during WW2, where he cared for the kids under his charge. Despite numerous chances to escape, he chose to remain with his wards when they were deported to the Treblinka extermination camp in 1942.", image: janusz_korczak },
    // Add more profiles
  ];

  return (
    <div className="ww2-page">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back
      </button>
      <h1>World War II</h1>
      <div className="profiles-grid">
        {profiles.map((profile) => (
          <div key={profile.id} className="profile-card">
            <img src={profile.image} alt={profile.name} />
            <h2>{profile.name}</h2>
            <p>{profile.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
