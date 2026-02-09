import React, { useState } from 'react';
import { Heart, Stars, PartyPopper, Frown, ArrowRight, Music, Utensils, Smile } from 'lucide-react';

export default function Valentine() {
  const [stage, setStage] = useState('welcome'); // welcome, reasons, question, success
  const [noCount, setNoCount] = useState(0);
  const [currentReason, setCurrentReason] = useState(0);

  // --- CONTENT CONFIGURATION ---
  // You can customize these reasons!
  const reasons = [
    {
      icon: <Utensils size={40} color="#ff4d6d" />,
      title: "I know the best food spots",
      desc: "I promise you will never be hangry around me."
    },
    {
      icon: <Music size={40} color="#ff4d6d" />,
      title: "I have impeccable taste in music",
      desc: "(Okay, mostly impeccable. I'll let you control the AUX.)"
    },
    {
      icon: <Smile size={40} color="#ff4d6d" />,
      title: "I give world-class hugs",
      desc: "Rated 5 stars by my mom and my dog."
    },
    {
      icon: <Stars size={40} color="#ff4d6d" />,
      title: "I think you're pretty neat",
      desc: "Like, really, really neat."
    }
  ];

  const noPhrases = [
    "No",
    "Are you sure?",
    "Really sure?",
    "Think again!",
    "Last chance!",
    "Surely not?",
    "You might regret this!",
    "Give it another thought!",
    "Are you absolutely certain?",
    "This could be a mistake!",
    "Have a heart!",
    "Don't be so cold!",
    "Change of heart?",
    "Wouldn't you reconsider?",
    "Is that your final answer?",
    "You're breaking my heart ;(",
    "Plsss? :((",
    "I'm gonna cry...",
    "You're killing me smalls",
    "Okay, now I'm just sad",
    "Fine, I'll ask again!"
  ];

  // --- HANDLERS ---

  const handleNextReason = () => {
    if (currentReason < reasons.length - 1) {
      setCurrentReason(currentReason + 1);
    } else {
      setStage('question');
    }
  };

  const handleNoClick = () => {
    setNoCount(noCount + 1);
  };

  const getNoText = () => {
    return noPhrases[Math.min(noCount, noPhrases.length - 1)];
  };

  // --- STYLES OBJECT ---
  const styles = {
    container: {
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fff0f3', // light pink bg
      fontFamily: '"Nunito", "Segoe UI", sans-serif',
      padding: '20px',
      overflow: 'hidden',
      position: 'relative',
    },
    card: {
      backgroundColor: 'white',
      padding: '40px',
      borderRadius: '24px',
      boxShadow: '0 10px 40px rgba(255, 77, 109, 0.15)',
      maxWidth: '500px',
      width: '100%',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px',
      zIndex: 10,
      transition: 'all 0.3s ease',
    },
    title: {
      color: '#c9184a',
      fontSize: '28px',
      fontWeight: '800',
      marginBottom: '10px',
      lineHeight: '1.2',
    },
    text: {
      color: '#590d22',
      fontSize: '18px',
      lineHeight: '1.6',
      marginBottom: '20px',
    },
    buttonPrimary: {
      backgroundColor: '#ff4d6d',
      color: 'white',
      border: 'none',
      padding: '16px 32px',
      fontSize: '18px',
      fontWeight: 'bold',
      borderRadius: '50px',
      cursor: 'pointer',
      transition: 'transform 0.2s, background-color 0.2s',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      boxShadow: '0 4px 15px rgba(255, 77, 109, 0.4)',
    },
    buttonSecondary: {
      backgroundColor: '#ffe5ec',
      color: '#c9184a',
      border: '2px solid transparent',
      padding: '12px 24px',
      fontSize: '16px',
      fontWeight: '700',
      borderRadius: '50px',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    // Dynamic styles for the comical interaction
    yesButtonDynamic: {
      backgroundColor: '#2dc653', // Green for YES
      color: 'white',
      border: 'none',
      borderRadius: '50px',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)', // Bouncy transition
      fontSize: `${Math.min(16 + noCount * 20, 150)}px`, // Caps font size eventually
      padding: `${Math.min(16 + noCount * 10, 100)}px ${Math.min(32 + noCount * 20, 200)}px`,
      boxShadow: '0 4px 15px rgba(45, 198, 83, 0.4)',
      zIndex: 100, // Make sure it sits on top eventually
    },
    noButtonDynamic: {
      backgroundColor: '#ff4d6d',
      color: 'white',
      border: 'none',
      borderRadius: '50px',
      padding: '16px 32px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    iconWrapper: {
      backgroundColor: '#fff0f3',
      padding: '20px',
      borderRadius: '50%',
      marginBottom: '10px',
      display: 'inline-flex',
    },
    backgroundHeart: {
      position: 'absolute',
      color: 'rgba(255, 77, 109, 0.1)',
      zIndex: 0,
    }
  };

  // --- RENDER STAGES ---

  if (stage === 'welcome') {
    return (
      <div style={styles.container}>
        {/* Decorative Background */}
        <Heart style={{...styles.backgroundHeart, top: '10%', left: '10%'}} size={100} />
        <Heart style={{...styles.backgroundHeart, bottom: '20%', right: '10%'}} size={150} />

        <div style={styles.card}>
          <div style={styles.iconWrapper}>
            <Heart size={48} color="#ff4d6d" fill="#ff4d6d" />
          </div>
          <h1 style={styles.title}>Hey there!</h1>
          <p style={styles.text}>
            I have a very important question to ask you. <br/>
            But first, a few reasons why you should say yes...
          </p>
          <button 
            style={styles.buttonPrimary}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            onClick={() => setStage('reasons')}
          >
            Tell me more <ArrowRight size={20} />
          </button>
        </div>
      </div>
    );
  }

  if (stage === 'reasons') {
    const reason = reasons[currentReason];
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={{...styles.iconWrapper, transform: 'scale(1.1)'}}>
            {reason.icon}
          </div>
          <h2 style={styles.title}>{reason.title}</h2>
          <p style={styles.text}>{reason.desc}</p>
          
          <div style={{display: 'flex', gap: '8px', marginBottom: '20px'}}>
            {reasons.map((_, idx) => (
              <div 
                key={idx} 
                style={{
                  width: '8px', 
                  height: '8px', 
                  borderRadius: '50%', 
                  backgroundColor: idx === currentReason ? '#ff4d6d' : '#ffe5ec',
                  transition: 'background-color 0.3s'
                }} 
              />
            ))}
          </div>

          <button 
            style={styles.buttonPrimary}
            onClick={handleNextReason}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            {currentReason === reasons.length - 1 ? "Okay, what's the question?" : "Next Reason"}
          </button>
        </div>
      </div>
    );
  }

  if (stage === 'question') {
    return (
      <div style={styles.container}>
        <Heart style={{...styles.backgroundHeart, top: '5%', left: '5%'}} size={80} />
        <Heart style={{...styles.backgroundHeart, bottom: '5%', right: '5%'}} size={80} />
        
        <div style={styles.card}>
          <h1 style={{...styles.title, fontSize: '32px'}}>Will you be my Valentine?</h1>
          <div style={{
            display: 'flex', 
            flexWrap: 'wrap', 
            justifyContent: 'center', 
            alignItems: 'center', 
            gap: '20px', 
            marginTop: '20px'
          }}>
            {/* The YES Button - Grows based on noCount */}
            <button
              style={styles.yesButtonDynamic}
              onClick={() => setStage('success')}
            >
              YES {noCount > 0 && `(${noCount * 100}% sure)`}
            </button>

            {/* The NO Button - Changes text */}
            <button
              style={styles.noButtonDynamic}
              onClick={handleNoClick}
            >
              {getNoText()}
            </button>
          </div>
          {noCount > 1 && (
             <div style={{marginTop: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: '#ff4d6d'}}>
               <Frown size={20} /> 
               <span style={{fontSize: '14px', fontStyle: 'italic'}}>Don't be like that...</span>
             </div>
          )}
        </div>
      </div>
    );
  }

  if (stage === 'success') {
    return (
      <div style={{...styles.container, backgroundColor: '#ffccd5'}}>
        <div style={{...styles.card, transform: 'scale(1.1)', border: '4px solid #fff'}}>
          <div style={{position: 'relative'}}>
             <PartyPopper size={64} color="#ff4d6d" />
             <Heart 
               size={32} 
               color="#ff4d6d" 
               fill="#ff4d6d" 
               style={{position: 'absolute', top: -10, right: -10, animation: 'bounce 1s infinite'}} 
             />
          </div>
          
          <h1 style={{...styles.title, fontSize: '42px', marginTop: '20px'}}>YAYYYYY!!!</h1>
          <p style={{...styles.text, fontSize: '20px', fontWeight: 'bold'}}>
            I knew you'd say yes! (Eventually) 😉
          </p>
          <p style={styles.text}>
            You're the best! Can't wait! ❤️
          </p>
          <div style={{fontSize: '60px'}}>🌹🍫🎬</div>
        </div>
        
        {/* Simple animation styles injected dynamically */}
        <style>
          {`
            @keyframes bounce {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-20px); }
            }
          `}
        </style>
      </div>
    );
  }

  return null;
}