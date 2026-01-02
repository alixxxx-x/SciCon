import "./about.css";

export default function AboutPage() {
    return (
        <div className="about-container">
            <section className="about-header">
                <h1>About SciCon.</h1>
                <p>Learn more about our mission and the team behind this platform.</p>
            </section>
            
            <section className="about-section">
                <div className="section-content">
                    <h2>Our Mission</h2>
                    <p>
                       SciCon was founded in 2024 to help health professionals and researchers 
                        find the best medical conferences and workshops in Algeria. We want to make 
                        scientific knowledge more accessible to everyone in the medical field.
                    </p>
                </div>
            </section>
            
            <section className="about-section dark-bg">
                <div className="section-content">
                    <h2>The Team</h2>
                    <div className="team-grid">
                        <div className="team-member">  
                            <div className="member-photo">MD</div>
                            <h3>Dr. Sara Ben Ahmed</h3>
                            <p>Medical Director</p>
                        </div>
                        
                        <div className="team-member">
                            <div className="member-photo">TL</div>
                            <h3>Karim Belkacemi</h3>
                            <p>Tech Lead</p>
                        </div>
                        
                        <div className="team-member">
                            <div className="member-photo">EC</div>
                            <h3>Lydia Mensouri</h3>
                            <p>Event Coordinator</p>
                        </div>
                    </div>
                </div>
            </section>
            
            <section className="about-section">
                <div className="section-content">
                    <h2>Our History</h2>
                    <p>
                        We started as a small university project and grew into a platform that 
                        now supports over 50 medical events per year. We are proud to serve the 
                        Algerian scientific community.
                    </p>
                </div>
            </section>
        </div>
    );
}