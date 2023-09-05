import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import ChatbotImage from '../images/3d-casual-life-chatgpt-robot-turning-right.png';
import AnalyticsImage from '../images/simplistic-web-analytics-on-computer-screen.gif';
import JournalImage from '../images/techny-notebook-pen-and-stickers.png';
import NewsImage from '../images/storyline-newspaper-analytics-and-morning-coffee.png';
import BalanceScaleImage from '../images/bubble-gum-scales-of-themis.png';
import User1 from '../images/Seikano.jpg';
import User2 from '../images/Refentse.jpg';
import User3 from '../images/Q.jpg';
import SnowAILogo from '../images/snowAI (1).png';


export default function LandingPage() {
  const navigate = useNavigate();
  const hiddenElementsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('hidden');
        }
      });
    });

    hiddenElementsRef.current.forEach((el) => {
      if (el instanceof Element) {
        observer.observe(el);
      }
    });

    return () => {
      hiddenElementsRef.current.forEach((el) => {
        if (el instanceof Element) {
          observer.unobserve(el);
        }
      });
    };
  }, []);

  const handleGetStarted = () => {
    navigate("/register");
  };


  return (
    <div>
      <header>
        <div className="logo">snowAI</div>
        <div className="action-buttons">
          <div><Link to="/login" className="landing-page-login">Login</Link></div>
          <button onClick={handleGetStarted}>Get Started</button>
        </div>
      </header>

      <main>
        <div id="hero-section">
          <h1>
          Where Traders Thrive: Join the <span className="secondary-color">snowAI</span> Revolution
          </h1>
          <p>
          Discover the future of trading with snowAI. Our cutting-edge platform empowers traders of all levels to make informed decisions, harness the power of AI, and unlock the path to financial success. Join us in redefining the trading experience.
          </p>
          <button onClick={handleGetStarted}>Get Started</button>
        </div>

        <div id="introduction">
          <div className="left hidden" ref={(el) => hiddenElementsRef.current.push(el)}>
            <h2>What you need to know about us</h2>
            <p className="our-mission">
            At snowAI, our mission is clear: to empower traders worldwide with cutting-edge AI technology. We're here to revolutionize the trading experience, providing you with the tools and knowledge you need to thrive in the financial markets.
            </p>
          </div>
          <div className="right hidden" ref={(el) => hiddenElementsRef.current.push(el)}>
            <div className="img-cover">
            <img className="balance-scale-img" src={SnowAILogo} />
            </div>
          </div>
        </div>
        <div id="features">
          <div className="feature-1">
            <div>
              <div className="img-cover hidden" ref={(el) => hiddenElementsRef.current.push(el)}>
                <img className="chatbot-landing-page" src={ChatbotImage} />
              </div>
            </div>
            <div className="content hidden" ref={(el) => hiddenElementsRef.current.push(el)}>
              <h3>AI Chatbot</h3>
              <p className="feature">
              Our AI chatbot is your trading companion 24/7. It offers real-time insights, answers your trading questions, and helps you make informed decisions in the ever-changing markets. Say hello to a smarter way to trade.
              </p>
            </div>
          </div>

          <div className="feature-2 alt-background">
            <div style={{ order: 2 }}>
              <div className="img-cover hidden" ref={(el) => hiddenElementsRef.current.push(el)}>
              <img className="chatbot-landing-page" src={AnalyticsImage} />
              </div>
            </div>
            <div className="content hidden" style={{ order: 1 }} ref={(el) => hiddenElementsRef.current.push(el)}>
              <h3>Trading History Analytics</h3>
              <p className="feature">
                Explore your trading history like never before. Our advanced analytics tools provide in-depth insights into your past trades, helping you spot trends, refine your strategies, and make data-driven decisions for future success.
              </p>
            </div>
          </div>

          <div className="feature-3">
            <div>
              <div className="img-cover hidden" ref={(el) => hiddenElementsRef.current.push(el)}>
              <img className="chatbot-landing-page" src={NewsImage} />
              </div>
            </div>
            <div className="content hidden" ref={(el) => hiddenElementsRef.current.push(el)}>
              <h3>Upcoming News Events</h3>
              <p className="feature">
                Stay ahead of the curve with our 'Upcoming News Events' feature. Get real-time updates on market-moving news, economic events, and announcements that could impact your trades. Knowledge is power, and we're here to keep you informed.
              </p>
            </div>
          </div>

          <div className="feature-4 alt-background">
            <div style={{ order: 2 }}>
              <div className="img-cover hidden" ref={(el) => hiddenElementsRef.current.push(el)}>
              <img className="journal-landing-page" src={JournalImage} />
              </div>
            </div>
            <div className="content hidden" style={{ order: 1 }} ref={(el) => hiddenElementsRef.current.push(el)}>
              <h3>Personal Journal</h3>
              <p className="feature">
              Your trading journey, your journal. Our 'Personal Journal' feature is your space to record thoughts, strategies, and insights. It's more than a journal; it's your trading companion, helping you track progress, learn from experiences, and evolve as a trader.
              </p>
            </div>
          </div>
        </div>

        <div id="more">
          <div className="img-wrapper hidden" ref={(el) => hiddenElementsRef.current.push(el)}>
            <div className="img-cover">
            <img className="balance-scale-img" src={BalanceScaleImage} alt="Balance scale image" />
            </div>
          </div>
          <div className="content hidden" ref={(el) => hiddenElementsRef.current.push(el)}>
            <h2>Our Mission</h2>
            <p className="feature">
              At snowAI, our mission is crystal clear: to empower traders of all backgrounds with the knowledge and tools they need to thrive in the financial markets. We're here to level the playing field, democratize trading, and pave the way for financial success.
            </p>
            <button onClick={handleGetStarted}>Get Started</button>
          </div>
        </div>

        <div id="customer-reviews">
          <h2>What our customers say about us</h2>

          <div className="content">
            <div className="review hidden" ref={(el) => hiddenElementsRef.current.push(el)}>
              <blockquote>
                Good for people to keep records of their trades and learn from them.
              </blockquote>
              <div className="headshot img-cover">
                <img src={User1} alt="user1" className="user" />
              </div>
              <cite><em>S. Modise</em></cite>
            </div>
            <div className="review hidden" ref={(el) => hiddenElementsRef.current.push(el)}>
              <blockquote>
              The product is a good beginners guide, and it is quite informative.
              </blockquote>
              <div className="headshot img-cover">
              <img src={User2} alt="user2" className="user" />
              </div>
              <cite><em>R. Malatjie</em></cite>
            </div>
            <div className="review hidden" ref={(el) => hiddenElementsRef.current.push(el)}>
              <blockquote>
                It's a much needed help. It helps you keep track of your performance.
              </blockquote>
              <div className="headshot img-cover"></div>
              <cite><em>M. Motingwe</em></cite>
            </div>
            <div className="review hidden" ref={(el) => hiddenElementsRef.current.push(el)}>
              <blockquote>
                I'm excited about what the product could turn into for me.
              </blockquote>
              <div className="headshot img-cover">
              <img src={User3} alt="user3" className="user" />
              </div>
              <cite><em>N. Mlaba</em></cite>
            </div>
          </div>
        </div>
      </main>

      <footer>
        <h2>Get in touch</h2>
        <div className="content">
          <div>
            <i className="bi bi-telephone-fill"></i>
            <span>+27 84 731 6417</span>
          </div>
          <div>
            <i className="bi bi-envelope-fill"></i>
            <span>motingwetlotlo@yahoo.com</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
