import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import isaac_babel from '../images/Isaac_Babel.jpg';
import nikolai_vavilov from '../images/nikolai_vavilov.jpg';
import lev_kamenev from '../images/lev_kamenev.jpg';
import maria_spiridonova from '../images/maria_spiridonova.jpg';
import nikolai_bukharin from '../images/nikolai_bukharin.jpg';
import olga_kameneva from '../images/olga_kameneva.jpg';
import yevgenia_ginzburg from '../images/yevgenia_ginzburg.jpg';

export default function StalinistSovietUnion() {
  const navigate = useNavigate();

  const profiles = [
    { id: 1, name: "Isaac Babel", description: "Isaac Babel was a prolific Russian writer known for his poignant and vivid depictions of life in early 20th century Russia, particularly within the Jewish community and amidst the chaos of the Russan Civil War. His works, including short stories such as 'Red Cavalry', showcased his keen insight into human nature and the complexities of war. Babel fell victim to Stalin's Great Purge in the late 1930s, enduring imprisonement, torture, and eventual execution in 1940 for alleged anti-Soviet activities (terrorism and espionage).", image: isaac_babel, country: "Soviet Union"},
    { id: 2, name: "Nikola Vavilov", description: "Nikolai Vavilov was a leading Soviet geneticist and botanist known for his work on plant genetics and crop diversity. He opposed Lysenkoism, a politically favoured, but scientifically flawed agricultural theory. Vavilov was arrested in 1940 and died of malnutrition in a Soviet prison in 1943, a victim of Stalin's purges against intellectuals and scientists.", image: nikolai_vavilov, country: "Soviet Union"},
    { id: 3, name: "Lev Kamenev", description: "Lev Kamenev, born Lev Borisovich Rosenfeld on July 18, 1883, was a key Russian revolutionary and Soviet politician. A founding member of the Bolshevik faction, he played a significant role in the 1917 Russian Revolution and held various prominent positions in the Soviet government, including Chairman of the All-Russian Congress of Soviets. Initially part of the leadership trio with Stalin and Zinoviev, Kamenev later opposed Stalin and faced political downfall. He was executed during the Great Purge in 1936.", image: lev_kamenev, country: "Soviet Union"},
    { id: 4, name: "Maria Spiridonova", description: "Maria Spiridonova was a notable Russian revolutionary and political figure, born on October 16, 1884. She gained fame for assassinating a government official in 1906, which resulted in her severe treatment in prison and garnered widespread sympathy. Spiridonova was a leading member of the Socialist Revolutionary Party and later the Left Socialist-Revolutionaries. Although she initially supported the Bolsheviks, she later opposed them. Throughout her life, Spiridonova faced numerous arrests, imprisonment, and exile under both the Tsarist and Soviet regimes. Tragically, she was executed by the Soviet secret police in 1941.", image: maria_spiridonova, country: "Soviet Union"},
    { id: 5, name: "Nikolai Bukharin", description: "Nikolai Bukharin was a key Bolshevik revolutionary and influential Soviet politician, born on October 9, 1888, in Moscow. He joined the Russian Social Democratic Labour Party in 1906 and quickly became a leading figure in the Bolshevik faction. Bukharin played a crucial role in the Russian Revolution of 1917 and later held significant positions such as editor of Pravda and a member of the Politburo. Known for his support of the New Economic Policy (NEP), he initially aligned with Lenin's ideas. However, he fell out of favor with Stalin during the power struggle following Lenin's death. Bukharin was ultimately executed on March 15, 1938, during the Great Purge.", image: nikolai_bukharin, country: "Soviet Union"},
    { id: 6, name: "Olga Kameneva", description: "Olga Kameneva, born Olga Davidovna Bronstein on November 7, 1883, in Yanovka, Ukraine, was a notable Russian Bolshevik revolutionary and Soviet politician. She was the sister of Leon Trotsky and the first wife of Lev Kamenev. Kameneva joined the Russian Social Democratic Labour Party in 1902 and played a significant role in the revolutionary movement. After the October Revolution, she held important positions, including heading the Theater Division of the People's Commissariat for Education and serving on the board of the Soviet Communist Party's Women's Section. Unfortunately, she fell victim to Stalin's purges and was executed on September 11, 1941.", image: olga_kameneva, country: "Soviet Union"},
    { id: 7, name: "Yevgenia Ginzburg", description: "Yevgenia Ginzburg was a Russian author and educator born on December 20, 1904, in Moscow. As a committed member of the Communist Party, she worked as a teacher and journalist. During Stalin's purges in the 1930s, Ginzburg was arrested and sentenced to 18 years in the Gulag, where she faced severe conditions. She later recounted her experiences in her two-volume memoir, 'Journey into the Whirlwind' and 'Within the Whirlwind,' which provide a vivid account of her time as a political prisoner. Ginzburg passed away on May 25, 1977, in Moscow.", image: yevgenia_ginzburg, country: "Soviet Union"},
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
      <h1>Soviet Union Atrocities</h1>
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
