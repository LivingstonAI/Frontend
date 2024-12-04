import React from "react";
import { useNavigate } from "react-router-dom";

export default function Sections() {
  const navigate = useNavigate();

  const categories = [
    { id: "ww2", title: "World War II", description: "Explore stories from WW2" },
    { id: "ww1", title: "World War I", description: "Stories from WW1" },
    { id: "maoist-china", title: "Maoist China", description: "Tales from the Maoist era" },
    { id: "stalin-soviet", title: "Stalinist Soviet Union", description: "Soviet repression stories" },
    { id: "apartheid-south-africa", title: "Apartheid South Africa", description: "Stories of oppression during apartheid" },
    { id: "holocaust", title: "The Holocaust", description: "Stories of survival and loss during the Holocaust" },
    { id: "nanjing-massacre", title: "Nanjing Massacre", description: "Horrors of the Japanese invasion of Nanjing" },
    { id: "ukrainian-holodomor", title: "Ukrainian Holodomor", description: "The man-made famine under Stalin" },
    { id: "rwandan-genocide", title: "Rwandan Genocide", description: "Tragic tales from the Rwandan genocide" },
    { id: "armenian-genocide", title: "Armenian Genocide", description: "Stories of the Armenian genocide" },
    { id: "khmer-rouge", title: "Khmer Rouge Cambodia", description: "Life under Pol Pot's regime" },
    { id: "partition-india", title: "Partition of India", description: "Stories from the partition of India" },
    { id: "bosnian-war", title: "Bosnian War", description: "Tales from the Bosnian War" },
    { id: "vietnam-war", title: "Vietnam War", description: "Insights from the Vietnam War" },
    { id: "korean-war", title: "Korean War", description: "Tales from the Korean War" },
    { id: "japanese-empire", title: "Japanese Empire", description: "Imperial Japan's impact on Asia" },
  ];

  return (
    <div className="sections-page">
      <h1>Explore by Category</h1>
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back
      </button>
      <div className="categories-grid">
        {categories.map((category) => (
          <div
            key={category.id}
            className="category-card"
            onClick={() => navigate(`/sections/${category.id}`)}
          >
            <h2>{category.title}</h2>
            <p>{category.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
