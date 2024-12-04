import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import sophie_scholl from '../images/sophie_scholl.jpeg';
import major_bronisław_bohatyrewicz from '../images/major_bronisław_bohatyrewicz.jpg';
import akiko_takakura from '../images/akiko_takakura.jpg';
import tom_derrick from '../images/tom_derrick.jpg';
import no_profile_img from '../images/no_profile_picture.jpg';


export default function WW2() {
  const navigate = useNavigate();

  const profiles = [
    { id: 1, name: "Sophie Scholl", description: "Sophie Scholl was a courageous student in Nazi Germany. Alongside her brother Hans and other members of the White Rose resistance group, she bravely spoke out against the Nazi regime through the distribution of anti-war leaflets at the University of Munich. Her unwavering defiance of tyranny ultimately led to her arrest, trial, and tragic execution by guillotine in 1943 at the age of 21.", image: sophie_scholl, country: "Germany"},
    { id: 2, name: "Major Bronisław Bohatyrewicz", description: "Major Bronisław Bohatyrewicz was a distinguished Polish military commander born on February 24, 1870, in Grodno. He joined the Imperial Russian Army before transferring to the Polish Army in 1918. Bohatyrewicz played a significant role in the Polish-Bolshevik War and was the commander of the 81st Infantry Regiment. After retiring from active duty, he was arrested by the NKVD in 1939 and tragically murdered during the Katyn massacre in 1940. His legacy is honored with several military awards, including the Silver Cross of the Order of Virtuti Militari.", image: major_bronisław_bohatyrewicz, country: "Poland"},
    { id: 3, name: "Friedrich Reichert", description: "Friedrich Reichert was a 14-year-old boy who was killed during the Allied bombing of Dresden in World War II. The bombing occurred between February 13 and 15, 1945, and resulted in the deaths of thousands of civilians, causing extensive destruction throughout the city. Friedrich's life was among those tragically cut short during this devastating event.", image: no_profile_img, country: "Germany"},
    { id: 4, name: "Akiko Takakura", description: "Akiko Takakura was a 20-year-old woman working at the Bank of Hiroshima when the atomic bomb was dropped on August 6, 1945. She was only 300 meters away from the hypocenter and miraculously survived despite sustaining over 100 lacerated wounds on her back. Akiko is one of the few survivors who were within such close proximity to the blast. She has since shared her harrowing experience and continues to educate others about the impact of the bombing.", image: akiko_takakura, country: "Japan" },
    { id: 5, name: "Lieutenant Thomas Currie Derrick", description: "Lieutenant Thomas Currie Derrick, commonly known as 'Diver,' was an Australian soldier born on March 20, 1914, in Adelaide, South Australia. He enlisted in the Second Australian Imperial Force in 1940 and served with the 2/48th Battalion. Derrick was awarded the Victoria Cross for his extraordinary bravery during the assault on Sattelberg, New Guinea, in November 1943. He led his platoon in a daring attack, scaling cliffs under heavy fire and neutralizing multiple machine gun posts. Tragically, he was mortally wounded during the Battle of Tarakan on May 24, 1945, and passed away later that day.", image: tom_derrick, country: "Australia"},
    
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
      <h1>World War II</h1>
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
