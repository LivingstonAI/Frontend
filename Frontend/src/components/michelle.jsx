import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Michelle1 from "../images/michelle_1.jpeg";
import Michelle2 from "../images/michelle_2.jpeg";
import Michelle3 from "../images/michelle_3.jpeg";
import Michelle4 from "../images/michelle_4.jpeg";
import Michelle5 from "../images/michelle_5.jpeg";
import Michelle6 from "../images/michelle_6.jpeg";
import Michelle7 from "../images/michelle_7.jpeg";
import Michelle8 from "../images/michelle_8.jpeg";
import Michelle9 from "../images/michelle_9.jpeg";
import Michelle10 from "../images/michelle_10.jpeg";
import Michelle11 from "../images/michelle_11.jpeg";
import Michelle12 from "../images/michelle_12.jpeg";
import Michelle13 from "../images/michelle_13.jpeg";
import Michelle14 from "../images/michelle_14.jpeg";


export default function Michelle() {
  const [message, setMessage] = useState("Click to reveal a surprise!");
  const [showGallery, setShowGallery] = useState(false);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [modalImage, setModalImage] = useState(null); // State to track which image is clicked
  const [showModal, setShowModal] = useState(false); // State to track modal visibility
  const navigate = useNavigate();


  const images = [
    Michelle1,
    Michelle2,
    Michelle3,
    Michelle4,
    Michelle5,
    Michelle6,
    Michelle7,
    Michelle8,
    Michelle9,
    Michelle10,
    Michelle11,
    Michelle12,
    Michelle13,
    Michelle14,
  ];

  const quotes = [
    "You are more amazing than words can describe. 💖",
    "Your kindness and warmth light up every room! 🌟",
    "Keep shining, Michelle! The world is lucky to have you. 🌸",
    "You inspire everyone around you with your strength and beauty. ✨",
    "Life feels better with someone as special as you in it. ❤️",
    "Every day is a new beginning. Embrace it with confidence! 🌞",
    "Your smile brightens even the darkest days. 😊",
    "Believe in yourself, and you can achieve anything. 🚀",
    "Happiness looks great on you. Keep shining, Michelle! 🌟",
    "You are a masterpiece – one of a kind, beautiful, and unique. 🎨",
    "The best is yet to come. Keep dreaming and striving. 💫",
    "Every moment with you is a blessing. Cherish it. 💕",
    "You are stronger than you think. Keep going, you’ve got this. 💪",
    "The world needs your light and your love. Keep being you. 🌍",
    "Great things happen when you believe in your journey. 🌈",
    "You are loved more than you’ll ever know. 💖",
    "Your life is your story, and you can write it however you want. 📖",
    "Your strength is an inspiration to all who know you. ✨",
    "Let your heart be your compass and your dreams your guide. 🌟",
    "Every day, you grow and become better. Believe in the journey. 🌱",
    "You matter. Don’t ever forget how amazing you are. 💫",
    "Stay positive, work hard, and make it happen. 🌞",
    "Your journey is yours alone. Own every moment of it. 🌠",
    "No one can do you like you. Keep being your authentic self. 💖",
    "You are loved, you are worthy, and you are enough. ❤️",
    "Your uniqueness is your superpower. Embrace it. 🦸‍♀️",
    "Every small step leads to great destinations. Keep walking. 🚶‍♀️",
    "Life isn’t about perfection, it’s about progress. 🌟",
    "Keep spreading your magic, Michelle. ✨",
  ];
  

  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
    }, 5000); // Change the quote every 5 seconds
    return () => clearInterval(quoteInterval);
  }, [quotes.length]);

  const handleSurprise = () => {
    // setMessage("Michelle, you light up the world! 🌟");
    navigate('/floating_flowers');
  };

  const viewPoetry = () => {
    // setMessage("Michelle, you light up the world! 🌟");
    navigate('/poetry_collection');
  };

  const toggleGallery = () => {
    setShowGallery(!showGallery);
  };

  const openModal = (imageSrc) => {
    setModalImage(imageSrc);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalImage(null);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Welcome to Michelle's World</h1>
      </header>
      <p style={styles.quote}>{quotes[currentQuoteIndex]}</p>
      <p style={styles.message}>{message}</p>
      <button style={styles.button} onClick={handleSurprise}>
        Click Me!
      </button>
      <button style={styles.galleryButton} onClick={toggleGallery}>
        {showGallery ? "Hide Gallery" : "Show Gallery"}
      </button>
      <button style={styles.button} onClick={viewPoetry}>
        View Poetry
      </button>
      {showGallery && (
        <div style={styles.gallery}>
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Michelle ${index + 1}`}
              style={styles.image}
              onClick={() => openModal(image)} // Open modal on click
            />
          ))}
        </div>
      )}

      {/* Modal Section */}
      {showModal && modalImage && (
        <div style={styles.modalOverlay} onClick={closeModal}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <img src={modalImage} alt="Expanded view" style={styles.modalImage} />
            <button style={styles.closeButton} onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}

      <footer style={styles.footer}>
        <p style={styles.footerText}>
          Made with ❤️ and lots of creativity for Michelle
        </p>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "'Arial', sans-serif",
    backgroundColor: "#ffe4e1",
    minHeight: "100vh",
    padding: "20px",
    color: "#5C4033",
  },
  header: {
    textAlign: "center",
    padding: "20px",
    backgroundColor: "#800000",
    color: "#fff",
    borderRadius: "10px",
  },
  title: {
    fontSize: "2.5rem",
    margin: 0,
  },
  quote: {
    fontSize: "1.2rem",
    fontStyle: "italic",
    textAlign: "center",
    margin: "20px 0",
    color: "#800000",
  },
  message: {
    fontSize: "1.5rem",
    textAlign: "center",
    margin: "20px 0",
  },
  button: {
    display: "block",
    margin: "10px auto",
    padding: "10px 20px",
    fontSize: "1rem",
    backgroundColor: "#ff69b4",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  galleryButton: {
    display: "block",
    margin: "10px auto",
    padding: "10px 20px",
    fontSize: "1rem",
    backgroundColor: "#a52a2a",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  gallery: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "10px",
    marginTop: "20px",
  },
  image: {
    width: "150px",
    height: "150px",
    objectFit: "cover",
    borderRadius: "10px",
    cursor: "pointer",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    position: "relative",
    maxWidth: "40%",
    maxHeight: "90%",
    textAlign: "center",
  },
  modalImage: {
    maxWidth: "100%",
    maxHeight: "100%",
    borderRadius: "10px",
  },
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    padding: "5px 10px",
    backgroundColor: "#ff69b4",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  footer: {
    textAlign: "center",
    marginTop: "40px",
    padding: "10px",
    backgroundColor: "#800000",
    color: "#fff",
    borderRadius: "10px",
  },
};
