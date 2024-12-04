import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import anne_frank from "../images/anne_frank.jpg";
import janusz_korczak from "../images/janusz_korczak.png";
import margot_frank from '../images/margot_frank.jpeg';
import edith_frank from '../images/edith_frank.jpeg';
import max_kolbe from '../images/max_kolbe.jpeg';
import hana_brady from '../images/hana_brady.jpg';
import lidia_zamenhof from '../images/lidia_zamenhof.jpg';



export default function Holocaust() {
  const navigate = useNavigate();

  const profiles = [
    { id: 1, name: "Anne Frank", description: "Anne Frank, born in Frankfurt, Germany, in 1929, was a Jewish girl who gained worldwide recognition through her diary. During WW2, her family went into hiding in Amsterdam's 'secret annex' to escape Nazi persecution. Her diary,, 'The Diary of a Young Girl', provides an account of life under Nazi occupation. She and her sister Margot were arrested in 1944 and later tried at the Bergen-Belsen concentration camp.", image: anne_frank, country: "Germany"},
    { id: 2, name: "Janusz Korczak", description: "Janusz Korzak was a compassionate Polish-Jewish educator, peditrician and children's author whose unwavering dedication to the welfare of the children left a mark on History. He ran an orphange in the Warsaw Ghetto during WW2, where he cared for the kids under his charge. Despite numerous chances to escape, he chose to remain with his wards when they were deported to the Treblinka extermination camp in 1942.", image: janusz_korczak, country: "Poland"},
    { id:3, name: "Margot Frank", description: "Margot Frank was born in Frankfurt, Germany, in 1926. During WW2, they went into hiding in a secret annex to avoid deportation. Margot, like her sister, kept a diary during this time, although hers was never recovered. Tragically, they were betrayed, arrested, and deported to Auschwitz concentration camp, where both Margot and Anne died of typhus shortly before liberation.", image: margot_frank, country: "Germany"},
    {id: 4, name: "Edith Frank", description: "Edith Frank, the mother of Anne Frank, was born in Aachen, Germany, and later married Otto Frank. They had 2 children, Anne and  Margot. During WW2, the family went into hiding in Amsterdam to escape the persecution of Jews by the Nazis. They were arrested in 1944. Edith Frank died in the Auschwitz concentration camp in January 1945.", image: edith_frank, country: "Germany"},
    { id: 5, name: "Maximilian Kolbe", description: "Maximilian Kolbe was a Polish Franciscan friar who exemplified selfless courage and compassion during the horrors of the Holocaust. In 1941,, Kolbe volunteered to take the place of a stranger at the Auschwitz concentration camp, demonstrating his unwavering dedication to his faith and his commitment to the sanctity of human life. His act of sacrificial love earned him recognition as a martyr, and he continues to be revered as a symbol of courage, compassion, and resistance against evil.", image: max_kolbe, country: "Poland"},
    { id: 6, name: "Hana Brady", description: "Hana Brady was a young Jewish girl from Czechoslovakia. She was imprisoned and eventually killed in Auschwitz during the Holocaust. Her story became widely known through the book 'Hana's Suitcase',  which details her life and the search to uncover her identity after a suitcase with her name on it was discovered in a Holocaust museum.", image: hana_brady, country: "Czechoslovakia"},
    { id: 7, name: "Lidia Zamenhof", description: "Lidia Zamenhof was a Jewish Polish writer, translator, and the youngest daughter of L. L. Zamenhof, the creator of Esperanto. Born on January 29, 1904, in Warsaw, she dedicated her life to promoting Esperanto and the Bahá'í Faith. Lidia translated many Bahá'í writings into Esperanto and traveled extensively to teach both the language and the religion. During World War II, she was arrested by the Nazis and ultimately perished at the Treblinka extermination camp in 1942.", image: lidia_zamenhof, country: "Poland"},
    // Add more profiles
  ];

  const [expandedProfiles, setExpandedProfiles] = useState([]);

  const toggleReadMore = (id) => {
    if (expandedProfiles.includes(id)) {
      setExpandedProfiles(expandedProfiles.filter((profileId) => profileId !== id));
    } else {
      setExpandedProfiles([...expandedProfiles, id]);
    }
  };


  return (
    <div className="ww2-page">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back
      </button>
      <h1>Holocaust</h1>
      <div className="profiles-grid">
        {profiles.map((profile) => {
          const isExpanded = expandedProfiles.includes(profile.id);
          const displayedText = isExpanded
            ? profile.description
            : profile.description.slice(0, 50) + "...";
          return (
            <div key={profile.id} className="profile-card">
              <img src={profile.image} alt={profile.name} />
              <h2>{profile.name}</h2>
              <p>
                {displayedText}
                <span
                  className="read-more-link"
                  onClick={() => toggleReadMore(profile.id)}
                >
                  {isExpanded ? " Read Less" : " Read More"}
                </span>
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );}
