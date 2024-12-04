import React from "react";
import { useNavigate } from "react-router-dom";


export default function Zhenya() {

    const navigate = useNavigate();

  return (
    <div className="zhenya-landing-page">
      <header className="zhenya-header">
        <h1 className="zhenya-title">Honoring the Memories</h1>
        <p className="zhenya-subtitle">
          A tribute to the victims of 20th-century atrocities
        </p>
      </header>

      <main className="zhenya-main-content">
        <section className="zhenya-intro-section">
          <h2>WELCOME</h2>
          <p>
            This platform is dedicated to preserving the stories and legacies
            of individuals who suffered in some of the darkest chapters of human
            history. Explore their lives, understand their struggles, and ensure
            their memories endure.
          </p>
        </section>

        <section className="zhenya-cta-section">
          <h3>Explore the Stories</h3>
          <p>Click below to start discovering profiles and their powerful stories.</p>
          <button
            className="zhenya-cta-button"
            onClick={() => navigate("/sections")}
        >
            Get Started
        </button>
        </section>
      </main>

      <footer className="zhenya-footer">
        <p>&copy; {new Date().getFullYear()} Honoring the Memories. All rights reserved.</p>
      </footer>
    </div>
  );
}
