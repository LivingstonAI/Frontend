import React from "react";
import { useNavigate } from "react-router-dom";

// Poetry collection - with real poetic tone and emotions
const poems = [
  {
    id: 1,
    title: "Whispers of the Wind",
    content: `"The whispers speak to the soul,\nBeneath the trees, a story unfolds.\nA gentle touch of time's refrain,\nThe echoes dance through wind and rain."`,
  },
  {
    id: 2,
    title: "Stars in Their Ballet",
    content: `"Stars pirouette in celestial skies,\nA thousand tales within their eyes.\nThey shimmer secrets, ancient and true,\nA silver ballet in midnight blue."`,
  },
  {
    id: 3,
    title: "Moonlight's Kiss",
    content: `"Beneath the pale moonlight's kiss,\nThe shadows dance, a fleeting bliss.\nDreams drift in waves, ethereal, bright,\nGuided by stars in the veil of night."`,
  },
  {
    id: 4,
    title: "Petals in the Breeze",
    content: `"Petals fall like whispered dreams,\nCarried by winds in golden streams.\nA fleeting moment, tender and true,\nThe earth hums a song just for you."`,
  },
  {
    id: 5,
    title: "A Symphony of Silence",
    content: `"Silence weaves through ancient halls,\nA symphony as the evening calls.\nTime forgets its restless chase,\nIn quiet arms, we find our place."}`,
  },
];

export default function PoetryCollection() {
  const navigate = useNavigate();

  return (
    <>
      {/* Back Button */}
      <button
        className="michelle-back-button"
        onClick={() => navigate(-1)} // Go back to the previous page
      >
        ← Back
      </button>

      {/* Poetry Collection Header */}
      <div className="poetry-header">
        <h1>Michelle's Poetry Collection ✍️</h1>
      </div>

      {/* List of Poetry */}
      <div className="poetry-list">
        {poems.map((poem) => (
          <div key={poem.id} className="poem-card">
            <h3 className="poem-title">{poem.title}</h3>
            <p className="poem-content">{poem.content}</p>
          </div>
        ))}
      </div>
    </>
  );
}

