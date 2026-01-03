import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import "../styles/Card.css";
function EventCard({ eventId }) {
  const [event, setEvent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/api/events/id/`);
        setEvent(response.data);
      } catch (error) {
        console.error("Error fetching event:", error);
      }
    };

    fetchEvent();
  }, [id]);

  const handleViewDetails = () => {
    navigate(`/events/${id}`);
  };

  if (!event) return <p>Loading...</p>;

  return (
    <div className="event-card">
      <div className="event-header">
        <span className="event-type">SCIENTIFIC MEETING</span>
        <span className="event-status">Upcoming</span>
      </div>

      <h2 className="event-title">{event.title}</h2>

      <p className="event-date">📅 {event.start_date}</p>
     
      <p className="event-location">📍 {event.venue}</p>
      <p className="event-description">{event.description}</p>

      <button className="event-button" onClick={handleViewDetails}>
        View details
      </button>
    </div>
  );
}

export default EventCard;
