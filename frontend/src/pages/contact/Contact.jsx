import { useState } from "react";
import "./contact.css";

export default function ContactPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [submitted, setSubmitted] = useState(false);

    // Function to handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        // Just show a success message for now
        console.log("Form submitted:", { name, email, message });
        setSubmitted(true);
    };

    return (
        <div className="contact-container">
            <section className="contact-header">
                <h1>Contact Us</h1>
                <p>Have a Question?! We'd love to hear from you.</p>
            </section>
            
            <div className="contact-content">
                <div className="info-box">
                    <h3>Information</h3>
                    <p><strong>Email:</strong> contact@events.dz</p>
                    <p><strong>Phone:</strong> +213 555 12 34 56</p>
                    <p><strong>Address:</strong> Constantine, Algeria</p>
                </div>
                
                <div className="form-box">
                    {submitted ? (
                        <div className="success-message">
                            <h3>Thank You!!!</h3>
                            <p>Your message has been sent. We will get back to you soon.</p>
                            <button onClick={() => setSubmitted(false)}>Send another message</button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Name</label>
                                <input 
                                    type="text" 
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)} 
                                    placeholder="Your Name" 
                                    required 
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Email</label>
                                <input 
                                    type="email" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    placeholder="Your Email" 
                                    required 
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Message</label> 
                                <textarea 
                                    value={message} 
                                    onChange={(e) => setMessage(e.target.value)} 
                                    placeholder="How can we help you ?" 
                                    rows={5} 
                                    required
                                ></textarea>
                            </div>
                            
                            <button type="submit" className="submit-btn">Send Message</button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}