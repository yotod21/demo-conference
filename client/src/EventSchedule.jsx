import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { apiGet } from "./api";

const EventSchedule = () => {
  const location = useLocation();
  const data = location.state;
  const eventId = data?.event?.id;
  const [schedules, setSchedules] = useState(data?.event?.schedules || []);

  // Fetch schedules from API if not in event object
  useEffect(() => {
    if (eventId && (!schedules || schedules.length === 0)) {
      (async () => {
        try {
          const allSchedules = await apiGet('/api/schedules');
          // Filter schedules for this event
          const eventSchedules = allSchedules.filter(s => s.EventId === eventId);
          if (eventSchedules.length > 0) {
            setSchedules(eventSchedules);
          }
        } catch (e) {
          console.error('Failed to fetch schedules:', e);
        }
      })();
    }
  }, [eventId]);

  return (
    <div>
      <table class="table caption-top rounded mt-2 bg-white">
        <caption className="text-white fs-4">Schedules</caption>
        <thead>
          <tr>
            <th>ID</th>
            <th>Date</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Activity</th>
          </tr>
        </thead>
        <tbody>
          {schedules.length > 0 ? (
            schedules.map((schedule, index) => {
              // Extract date from start_time if date field is not available
              const scheduleDate = schedule.date || (schedule.start_time ? new Date(schedule.start_time).toLocaleDateString() : '');
              // Format time from datetime if needed
              const startTime = schedule.start_time ? (schedule.start_time.includes('T') ? new Date(schedule.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : schedule.start_time) : '';
              const endTime = schedule.end_time ? (schedule.end_time.includes('T') ? new Date(schedule.end_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : schedule.end_time) : '';
              // Use title (from server model) or activity (from demo data) for display
              const activity = schedule.title || schedule.activity || '';
              
              return (
                <tr key={index}>
                  <th scope="row">{schedule.id}</th>
                  <td>{scheduleDate}</td>
                  <td>{startTime}</td>
                  <td>{endTime}</td>
                  <td>{activity}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="5" className="text-center text-muted">
                No schedules available
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <Link
        className="btn btn-success fw-bold"
        to={`/events/${data.event.id}/schedules/add`}
        state={{ event: data.event }}
      >
        <i class="bi bi-plus-circle"></i> Add Schedule
      </Link>
    </div>
  );
};

export default EventSchedule;
