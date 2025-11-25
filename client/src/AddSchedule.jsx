import React, { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { EventContext } from "./MyContext";

const AddSchedule = () => {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [activity, setActivity] = useState("");

  const { registerSchedule } = useContext(EventContext);

  const location = useLocation();
  const navigate = useNavigate();

  const data = location.state;
  const eventid = data?.event?.id;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Combine date and time for start_time and end_time
    const startDateTime = date && startTime ? `${date}T${startTime}:00` : null;
    const endDateTime = date && endTime ? `${date}T${endTime}:00` : null;

    const scheduledata = {
      EventId: eventid,
      title: activity || "Schedule Activity", // Use activity as title since model requires title
      start_time: startDateTime,
      end_time: endDateTime,
      location: "", // Optional field
    };

    const handleSuccess = (schedule_registered) => {
      // Navigate back to the schedules page
      navigate(`/events/${eventid}/schedules`, { state: { event: data.event } });
    };
    const handleError = () => {
      alert("Failed to add schedule. Please try again.");
    };

    registerSchedule(scheduledata, handleSuccess, handleError);
  };

  // Handle case where state might be undefined
  if (!data || !data.event || !eventid) {
    return (
      <div className="container text-white">
        <p>Error: Event data not found. Please go back and try again.</p>
        <button onClick={() => navigate('/events')} className="btn btn-primary">
          Back to Events
        </button>
      </div>
    );
  }

  return (
    <div className="container text-white">
      <h2>Add Schedule</h2>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col">
            <div className="mb-3">
              <label htmlFor="date" className="form-label">
                Date
              </label>
              <input
                type="date"
                className="form-control"
                id="date"
                name="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="start_time" className="form-label">
                Start Time
              </label>
              <input
                type="time"
                className="form-control"
                id="start_time"
                name="start_time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="end_time" className="form-label">
                End Time
              </label>
              <input
                type="time"
                className="form-control"
                id="end_time"
                name="end_time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="col">
            <div className="mb-3">
              <label htmlFor="activity" className="form-label">
                Activity
              </label>
              <textarea
                className="form-control"
                id="activity"
                name="activity"
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                required
              ></textarea>
            </div>
          </div>
        </div>
        <button type="submit" className="btn btn-primary">
          Add Schedule
        </button>
      </form>
    </div>
  );
};

export default AddSchedule;
