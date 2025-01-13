import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import wilfred_owen from "../images/wilfred_owen.png";
import edward_thomas from '../images/edward_thomas.jpg';
import edith_cavell from '../images/edith_cavell.jpg';
import louise_de_bettignies from '../images/louise_de_bettignies.jpg';
import john_mccrae from '../images/john_mccrae.jpg';
import william_barnard_rhodes_moorhouse from '../images/william_barnard_rhodes_moorhouse.jpg';
import marion_g_crandell from '../images/marion_g_crandell.png';
import no_profile_img from '../images/no_profile_picture.jpg';

export default function WW1() {
  const navigate = useNavigate();

  const profiles = [
    { id: 1, name: "Wilfred Owen", description: "Wilfred Owen was an English poet born on March 18, 1893, in Oswestry, Shropshire. He is renowned for his war poetry that vividly depicts the horrors of World War I, drawing from his own experiences on the front lines. Owen's work, including famous poems like 'Dulce et Decorum Est' and 'Anthem for Doomed Youth,' is celebrated for its emotional depth and stark realism. Tragically, he was killed in action on November 4, 1918, just one week before the Armistice, at the age of 25.", image: wilfred_owen, country: "England"},
    { id: 2, name: "Edward Thomas Shaw",  description: "Edward Thomas Shaw was a former pupil of Albert State School in Maryborough, Queensland, Australia. He enlisted in the Australian Army Service Corps during World War I and served as a driver. Shaw was killed in action on May 25, 1918, at the age of 24. His name is commemorated on a war memorial at the school, which was unveiled on December 14, 1917.", image: edward_thomas, country: "Australia"},
    { id: 3, name: "Edith Cavell", description: "Edith Cavell was a British nurse born on December 4, 1865, in Swardeston, Norfolk. She is renowned for her efforts during World War I, where she saved the lives of soldiers from both sides and helped over 200 Allied soldiers escape from German-occupied Belgium. Despite knowing the risks, Cavell's humanitarian efforts ultimately led to her arrest by the Germans. She was executed by firing squad on October 12, 1915, in Brussels. Cavell's legacy lives on as a symbol of courage and self-sacrifice.", image: edith_cavell, country: "England"},
    { id: 4, name: "Louise de Bettignies", description: "Louise de Bettignies was a French secret agent who spied on the Germans for the British during World War I using the pseudonym Alice Dubois. Born on July 15, 1880, in Saint-Amand-les-Eaux, France, she created an intelligence network that saved over a thousand British soldiers by providing crucial information. She was arrested in October 1915 and sentenced to death, but died in captivity in Cologne on September 27, 1918, before the sentence could be carried out. Louise de Bettignies is remembered for her bravery and significant contributions to the war effort.", image: louise_de_bettignies, country: "France"},
    { id: 5, name: "John McCrae", description: "John McCrae was a Canadian poet, physician, and soldier born on November 30, 1872, in Guelph, Ontario. He is best known for his iconic war poem 'In Flanders Fields,' written during World War I after the death of a friend in the Second Battle of Ypres. McCrae's poem became a symbol of remembrance and is widely recited on Remembrance Day. He served as a surgeon in the Canadian Army Medical Corps but tragically died of pneumonia on January 28, 1918, in Boulogne-sur-Mer, France.", image: john_mccrae, country: "Canada"},
    { id: 6, name: "William Barnard Rhodes-Moorhouse", description: "William Barnard Rhodes-Moorhouse was an English aviator and soldier born on September 26, 1887, in Rokeby, Yorkshire. He joined the Royal Flying Corps during World War I and became the first airman to be awarded the Victoria Cross for his bravery. On April 26, 1915, Rhodes-Moorhouse conducted a bombing raid on a railway junction near Merville, France, despite heavy enemy fire. He was mortally wounded during the mission and died the following day. His courage and sacrifice are commemorated with his burial at Parnham House, Dorset.", image: william_barnard_rhodes_moorhouse, country: "England"},
    { id: 7, name: "Marion G. Crandell", description: "Marion G. Crandell was an American educator and war worker born on April 25, 1872, in Cedar Rapids, Iowa. She served as a French teacher before volunteering for war relief work in France during World War I. In February 1918, she was working at a YMCA canteen near the front lines in Sainte-Menehould when a German artillery shell struck the building, killing her. Marion G. Crandell was the first American woman in active service to be killed in World War I.", image: marion_g_crandell, country: "United States of America"},
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
      <h1>World War I</h1>
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
