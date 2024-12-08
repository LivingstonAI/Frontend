import React from "react";
import { useNavigate } from "react-router-dom";

export default function Sections() {
  const navigate = useNavigate();

  const categories = [
    { id: "ww2", title: "World War II", description: "Explore stories from WW2" },
    { id: "ww1", title: "World War I", description: "Stories from WW1" },
    // { id: "maoist-china", title: "Maoist China", description: "Tales from the Maoist era" },
    { id: "stalin_soviet_union", title: "Stalinist Soviet Union", description: "Soviet repression stories" },
    { id: "holocaust", title: "The Holocaust", description: "Stories of survival and loss during the Holocaust" },
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
