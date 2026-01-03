 import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import "../styles/Form.css";

function EventForm({ route, method }) {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [venue, setVenue] = useState("");
  const [committee, setCommittee] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {

       const response = await api.post(route, {
        title,
        start_date: startDate,
        end_date: endDate,
        description,
        venue,
        committee

      });

      if (response.status === 201) {
        alert ("Event created successfully!");
      }
      else {
        alert ("Failed to create event.");
      }
      

    } catch (error) {
      alert("Error creating event.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h1>Create Event</h1>

      <input className="form-input" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
      <input className="form-input" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} placeholder="Start Date" />
      <input className="form-input" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} placeholder="End Date" />
      <textarea className="form-input" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
      <input className="form-input" type="text" value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="Venue" />
      <input className="form-input" type="text" value={organizer} onChange={(e) => setOrganizer(e.target.value)} placeholder="Organizer" />
      <input className="form-input" type="text" value={committee} onChange={(e) => setCommittee(e.target.value)} placeholder="Committee" />
      <input className="form-input" type="datetime-local" value={createdAt} onChange={(e) => setCreatedAt(e.target.value)} placeholder="Created At" />
      <input className="form-input" type="datetime-local" value={updatedAt} onChange={(e) => setUpdatedAt(e.target.value)} placeholder="Updated At" />

      <button className="form-button" type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Create Event"}
      </button>
    </form>
  );
}

export default EventForm;