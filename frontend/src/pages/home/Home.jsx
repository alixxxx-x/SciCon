import { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, Users, BookOpen, Award, ChevronLeft, ChevronRight, Star } from "lucide-react";
import "./home.css";


export default function HomePage() {
  const [openFaq, setOpenFaq] = useState(null);
  const [currentSpeaker, setCurrentSpeaker] = useState(0);
  const [rotatingText, setRotatingText] = useState("CONFERENCES");
  const [email, setEmail] = useState("");

  // Axios connection states
  const [backendData, setBackendData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState("");

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 17,
    hours: 5,
    minutes: 28,
    seconds: 56,
  });

  // Array of texts that rotate in the hero section
  const rotatingTexts = ["CONFERENCES", "WORKSHOPS", "SEMINARS", "TRAININGS", "MEETUPS"];

  // AXIOS CONNECTION TO DJANGO 
  useEffect(() => {
    console.log("Home page loaded - Axios is ready for API calls");
    setLoading(false);
  }, []);
  // Rotate the text every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const currentIndex = rotatingTexts.indexOf(rotatingText);
      const nextIndex = (currentIndex + 1) % rotatingTexts.length;
      setRotatingText(rotatingTexts[nextIndex]);
    }, 3000);

    return () => clearInterval(interval);
  }, [rotatingText]);

  // Update countdown timer every second
  useEffect(() => {
    const targetDate = new Date("2025-06-15T00:00:00").getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Past events data 
  const eventImages = [
    {
      src: "/src/assets/medical-conference.jpg",
      title: "Algerian Medical Research Conference 2023",
      date: "November 15-17, 2023",
    },
    {
      src: "/src/assets/algeria-health-workshop.jpg",
      title: "Healthcare Innovation Workshop Algiers",
      date: "September 8-10, 2024",
    },
    {
      src: "/src/assets/algeria-pharmacy-summit.jpg",
      title: "Pharmacy & Pharmacology Summit 2024",
      date: "July 25-28, 2024",
    },
  ];

  // Featured speakers 
  const speakers = [
    {
      name: "Dr. Elias Zerhouni",
      title: "Professor of Medicine",
      institution: "University of Algiers",
      image: "/src/assets/Elias Zerhouni.jpeg",
    },
    {
      name: "Prof. Khaled Bouzid",
      title: "Research Director",
      institution: "University of Oran",
      image: "/src/assets/Khaled Bouzid.jpg.png",
    },
    {
      name: "Dr. Sami el mekki",
      title: "Hospital Director",
      institution: "CHU Constantine",
      image: "/src/assets/sami el mekki.jpg",
    },
    {
      name: "Dr. Fatima Zohra Boukhemis",
      title: "Head of Cardiology",
      institution: "Mustapha Hospital Algiers",
      image: "/src/assets/Fatima Zohra.jpg.png",
    },
  ];

  // feedback
  const testimonials = [
    {
      name: "Dr. Ahmed Benali",
      title: "General Practitioner",
      institution: "Algiers Medical Center",
      quote: "Found great local workshops through this platform. Easy to use and very helpful.",
      rating: 4,
    },
    {
      name: "Dr. salima Lounis",
      title: "Medical Resident",
      institution: "Oran University Hospital",
      quote: "Perfect for finding continuing education events in our region.",
      rating: 5,
    },
    {
      name: "Prof. Karim Saidi",
      title: "University Professor",
      institution: "Constantine Medical School",
      quote: "Helped me organize my first research seminar. Good platform for academics.",
      rating: 4,
    },
  ];

  // FAQ questions and answers
  const faqs = [
    {
      question: "How do I register for an event?",
      answer: "Click 'Register Now' on any event page. Fill your details and you'll get a confirmation email.",
    },
    {
      question: "Are events free or paid?",
      answer: "We have both free and paid events. Check each event page for pricing details.",
    },
    {
      question: "Can students attend these events?",
      answer: "Yes! Many events offer student discounts. Look for 'Student Rate' on the registration page.",
    },
    {
      question: "Do I get a certificate?",
      answer: "Most events provide digital certificates. Check with the event organizer for details.",
    },
    {
      question: "How do I list my own event?",
      answer: "Contact us at info@SciCon with your event details to get listed on our platform.",
    },
  ];

  // Functions to navigate speakers carousel
  const nextSpeaker = () => {
    setCurrentSpeaker((prev) => (prev + 1) % speakers.length);
  };

  const prevSpeaker = () => {
    setCurrentSpeaker((prev) => (prev - 1 + speakers.length) % speakers.length);
  };

  // Handle newsletter form submission
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for subscribing to SciCon!");
    setEmail("");
  };

  return (
    <div className="homepage">
      {/* Simple Backend Connection Status */}
      {loading && (
        <div className="connection-status loading">
          Connecting to Django backend...
        </div>
      )}

      {connectionStatus === "success" && (
        <div className="connection-status success">
          Successfully connected to Django backend!
        </div>
      )}

      {connectionStatus === "error" && (
        <div className="connection-status error">
          Backend connection failed. Make sure Django server is running.
        </div>
      )}

      {/* Hero Section with Video Background */}
      <section className="hero-section">
        {/* Background video */}
        <div className="hero-background">
          <div className="hero-overlay" />
        </div>

        {/* Main hero content */}
        <div className="hero-content">
          <div className="hero-text-container">
            <h1 className="hero-main-title">SciCon</h1>
            <div className="hero-subtitle-wrapper">
              <h2 className="hero-subtitle" key={rotatingText}>
                {rotatingText}
              </h2>
            </div>
          </div>
          <div className="flex gap-4">
            <button className="hero-cta-button">EXPLORE EVENTS</button>
            <a href="/dashboard" className="hero-cta-button bg-indigo-600 hover:bg-indigo-700 border-none">DASHBOARD</a>
          </div>
        </div>
      </section>

      {/* Countdown Timer Section */}
      <section className="countdown-section">
        <div className="countdown-container">
          <h2 className="section-title">Next Event: Algerian Health Innovation Summit 2026</h2>
          <p className="event-details">January 15-17, 2026 | Algiers International Conference Center</p>

          <div className="countdown-grid">
            <div className="countdown-card">
              <div className="countdown-value">{timeLeft.days}</div>
              <div className="countdown-label">Days</div>
            </div>
            <div className="countdown-card">
              <div className="countdown-value">{timeLeft.hours}</div>
              <div className="countdown-label">Hours</div>
            </div>
            <div className="countdown-card">
              <div className="countdown-value">{timeLeft.minutes}</div>
              <div className="countdown-label">Minutes</div>
            </div>
            <div className="countdown-card">
              <div className="countdown-value">{timeLeft.seconds}</div>
              <div className="countdown-label">Seconds</div>
            </div>
          </div>

          <button className="register-button">Register Now</button>
        </div>
      </section>

      {/* Stats Section - Why Choose Us */}
      <section className="stats-section">
        <div className="stats-container">
          <h2 className="section-title">Why SciCon?</h2>

          <div className="stats-grid">
            <div className="stats-list">
              <div className="stat-item">
                <div className="stat-icon">
                  <Calendar className="icon" />
                </div>
                <p className="stat-text">50+ medical events organized across Algeria</p>
              </div>

              <div className="stat-item">
                <div className="stat-icon">
                  <Users className="icon" />
                </div>
                <p className="stat-text">500+ healthcare professionals in our community</p>
              </div>

              <div className="stat-item">
                <div className="stat-icon">
                  <BookOpen className="icon" />
                </div>
                <p className="stat-text">100+ research papers presented locally</p>
              </div>

              <div className="stat-item">
                <div className="stat-icon">
                  <Award className="icon" />
                </div>
                <p className="stat-text">Partnered with 10+ Algerian medical institutions</p>
              </div>

              <p className="stats-description">
                Algeria's leading platform for healthcare events. Connect with local professionals, share knowledge, and advance your medical career.
              </p>
            </div>

            <div>
              <img
                src="/src/assets/algeria-doctors-meeting.jpg"

                className="stats-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="how-it-works-container">
          <h2 className="section-title">Simple & Easy</h2>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-icon">
                <Calendar size={48} />
              </div>
              <div className="step-number">01</div>
              <h3 className="step-title">Find Events</h3>
              <p className="step-description">
                Browse healthcare conferences, workshops, and training sessions in Algeria
              </p>
            </div>

            <div className="step-card">
              <div className="step-icon">
                <BookOpen size={48} />
              </div>
              <div className="step-number">02</div>
              <h3 className="step-title">Register Online</h3>
              <p className="step-description">Secure your spot with simple online registration</p>
            </div>

            <div className="step-card">
              <div className="step-icon">
                <Users size={48} />
              </div>
              <div className="step-number">03</div>
              <h3 className="step-title">Learn & Network</h3>
              <p className="step-description">Connect with Algerian healthcare professionals</p>
            </div>

            <div className="step-card">
              <div className="step-icon">
                <Award size={48} />
              </div>
              <div className="step-number">04</div>
              <h3 className="step-title">Grow Professionally</h3>
              <p className="step-description">Earn certificates and enhance your medical career</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="testimonials-container">
          <h2 className="section-title">What Algerian Doctors Say</h2>

          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-header">
                  <div className="testimonial-avatar">{testimonial.name.charAt(0)}</div>
                  <div>
                    <div className="testimonial-name">{testimonial.name}</div>
                    <div className="testimonial-title">{testimonial.title}</div>
                  </div>
                </div>
                <div className="testimonial-institution">{testimonial.institution}</div>
                <div className="testimonial-rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="testimonial-quote">{testimonial.quote}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="faq-container">
          <h2 className="section-title">Common Questions</h2>

          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <button className="faq-question" onClick={() => setOpenFaq(openFaq === index ? null : index)}>
                  <span>{faq.question}</span>
                  <span className={`faq-chevron ${openFaq === index ? "open" : ""}`}>›</span>
                </button>
                {openFaq === index && <div className="faq-answer">{faq.answer}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Past Events Gallery */}
      <section className="past-events-section">
        <div className="past-events-container">
          <h2 className="section-title">Previous Events</h2>
          <p className="section-description">Successful healthcare events we've hosted in Algeria</p>

          <div className="past-events-grid">
            {eventImages.map((event, index) => (
              <div key={index} className="past-event-card">
                <div className="past-event-image">
                  <img src={event.src || "/placeholder.svg"} alt={event.title} />
                  <div className="past-event-overlay">
                    <h3 className="past-event-title">{event.title}</h3>
                    <p className="past-event-date">{event.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Speakers Section */}
      <section className="speakers-section">
        <div className="speakers-background">

        </div>

        <div className="speakers-container">
          <h2 className="section-title">Algerian Medical Experts</h2>

          <div className="speakers-carousel">
            <div className="speaker-slide">
              <div className="speaker-card">
                <img
                  src={speakers[currentSpeaker].image || "/placeholder.svg"}
                  alt={speakers[currentSpeaker].name}
                  className="speaker-image"
                />
                <h3 className="speaker-name">{speakers[currentSpeaker].name}</h3>
                <p className="speaker-title">{speakers[currentSpeaker].title}</p>
                <p className="speaker-institution">{speakers[currentSpeaker].institution}</p>
              </div>
            </div>

            <button className="carousel-button carousel-button-prev" onClick={prevSpeaker}>
              <ChevronLeft size={24} />
            </button>
            <button className="carousel-button carousel-button-next" onClick={nextSpeaker}>
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter Signup Section */}
      <section className="newsletter-section">
        <div className="newsletter-container">
          <h2 className="section-title">Stay Informed</h2>
          <p className="newsletter-description">
            Get updates about medical events, workshops, and opportunities in Algeria.
          </p>

          <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
            <input
              type="email"
              placeholder="Your email address"
              className="newsletter-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="newsletter-button">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}