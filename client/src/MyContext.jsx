import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { apiGet, apiPost, apiPut, apiDelete } from "./api";
import { demoEvents, demoSpeakers, demoSponsors, demoAttendees } from "./demoData";

// Create the context
const EventContext = createContext();

// Create a provider component
const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [speakers, setSpeakers] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [attendees, setAttendees] = useState([]);
  const [eventUsers, setEventusers] = useState([]);
  // const [getUserById, setGetUserById] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );
  const [user, setUser] = useState(() =>
    sessionStorage.getItem("authTokens")
      ? jwtDecode(sessionStorage.getItem("authTokens"))
      : null
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, speakersRes, sponsorsRes, attendeesRes, usersRes] = await Promise.allSettled([
          fetchEvents(),
          fetchSpeakers(),
          fetchSponsors(),
          fetchAttendees(),
          fetchEventusers(),
        ]);

        // Use demo data as fallback if API fails or returns empty array
        if (eventsRes.status === 'fulfilled' && eventsRes.value && eventsRes.value.length > 0) {
          setEvents(eventsRes.value);
        } else {
          console.log('Using demo events data');
          setEvents(demoEvents);
        }

        if (speakersRes.status === 'fulfilled' && speakersRes.value && speakersRes.value.length > 0) {
          setSpeakers(speakersRes.value);
        } else {
          console.log('Using demo speakers data');
          setSpeakers(demoSpeakers);
        }

        if (sponsorsRes.status === 'fulfilled' && sponsorsRes.value && sponsorsRes.value.length > 0) {
          setSponsors(sponsorsRes.value);
        } else {
          console.log('Using demo sponsors data');
          setSponsors(demoSponsors);
        }

        if (attendeesRes.status === 'fulfilled' && attendeesRes.value && attendeesRes.value.length > 0) {
          setAttendees(attendeesRes.value);
        } else {
          console.log('Using demo attendees data');
          setAttendees(demoAttendees);
        }

        if (usersRes.status === 'fulfilled') setEventusers(usersRes.value); else console.error('users fetch failed', usersRes.reason);
      } catch (error) {
        console.error("Error fetching data, using demo data:", error);
        // Fallback to demo data on error
        setEvents(demoEvents);
        setSpeakers(demoSpeakers);
        setSponsors(demoSponsors);
        setAttendees(demoAttendees);
        setError("Error fetching data - displaying demo data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchSpeakers = async () => apiGet("/api/speakers");

  const fetchSponsors = async () => apiGet("/api/sponsors");

  const fetchAttendees = async () => apiGet("/api/attendees");

  const fetchEvents = async () => apiGet("/api/events");

  const fetchEventusers = async () => [];

  const addSpeaker = async (speakerData, onSuccess, onError) => {
    try {
      const data = await apiPost('/api/speakers', speakerData);
      setSpeakers((prev) => [...prev, data]);
      onSuccess(data);
    } catch (e) {
      onError();
    }
  };
  const addSponsor = async (sponsorData, onSuccess, onError) => {
    try {
      const data = await apiPost('/api/sponsors', sponsorData);
      setSponsors((prev) => [...prev, data]);
      onSuccess(data);
    } catch (e) { onError(); }
  };
  // const fetchGetUserById = async () => {
  //   const res = await fetch("api/users/<int:user_id>/");
  //   if (!res.ok) {
  //     throw new Error("failed to fetch user by id");
  //   }
  //   return res.json();
  // };

  // const getEvent = async (eventId) => {
  //   const res = await fetch(`http://10.240.68.67:8000/api/event/${eventId}`);
  //   const data = await res.json();
  //   return data.data;
  // };

  const createEvent = async (newEventData, onSuccess, onError) => {
    try {
      const createdEvent = await apiPost('/api/events', newEventData);
      setEvents((prev) => [...prev, createdEvent]);
      onSuccess(createdEvent);
    } catch (e) { onError(); }
  };

  const editEvent = async (eventId, updatedEventData, onSuccess, onError) => {
    try {
      const updatedEvent = await apiPut(`/api/events/${eventId}`, updatedEventData);
      setEvents((prev) => prev.map((e) => (e.id === eventId ? updatedEvent : e)));
      onSuccess(updatedEvent);
    } catch (e) { onError(); }
  };

  const toggleUserIsStaffById = async (userId, onSuccess, onError) => {
    try {
      // Fetch the current user data
      const response = await fetch(
        ` http://127.0.0.1:8000/api/eventusers/${userId}/`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const userData = await response.json();

      // Toggle the is_staff field
      const updatedIsStaff = !userData.is_staff;

      // Update the user with the new is_staff value and include other fields
      const updateResponse = await fetch(
        ` http://127.0.0.1:8000/api/eventusers/${userId}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: userData.username,
            fullname: userData.fullname,
            email: userData.email,
            password: userData.password,
            is_staff: updatedIsStaff,
          }),
        }
      );

      if (updateResponse.status === 200) {
        const updatedUser = await updateResponse.json();
        onSuccess(updatedUser);
      } else {
        onError();
      }
    } catch (error) {
      console.error("Error toggling user is_staff status:", error);
      onError();
    }
  };

  const deleteEvent = async (eventId, onSuccess, onError) => {
    try {
      await apiDelete(`/api/events/${eventId}`);
      setEvents((prev) => prev.filter((e) => e.id === undefined || e.id !== eventId));
      onSuccess();
    } catch (e) { onError(); }
  };

  const loginUser = async (userData, onSuccess, onError) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.user.is_staff);
        if (data.user.is_staff) {
          sessionStorage.setItem("userData", JSON.stringify(data));
          onSuccess(data);
        } else {
          onError(
            "Unauthorized access: You are not authorized to log in as a staff member."
          );
        }
      } else {
        onError();
      }
    } catch (error) {
      console.error("Login error:", error);
      onError();
    }
  };
  const logoutUser = () => {
    sessionStorage.removeItem("userData");
    setAuthTokens(null);
    setUser(null);
    console.log(sessionStorage.getItem("userData"));
  };

  const registerAttendee = async (attendeeData, onSuccess, onError) => {
    try {
      const data = await apiPost('/api/attendees', attendeeData);
      setAttendees((prev) => [...prev, data]);
      onSuccess(data);
    } catch (e) { onError(); }
  };

  const registerSpeaker = addSpeaker;

  const registerSponsor = addSponsor;

  const registerSchedule = async (scheduleData, onSuccess, onError) => {
    try {
      const data = await apiPost('/api/schedules', scheduleData);
      onSuccess(data);
    } catch (e) { onError(); }
  };

  const registerRoomid = async (roomData, onSuccess, onError) => onSuccess(roomData);

  const updateUserIsStaffById = async (userId, isStaff) => {
    try {
      const response = await fetch(`/api/users/${userId}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_staff: isStaff }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user is_staff status");
      }

      const updatedUserData = await response.json();
      return updatedUserData;
    } catch (error) {
      console.error("Error updating user is_staff status:", error);
      throw error;
    }
  };

  const contextValue = {
    events,
    toggleUserIsStaffById,
    createEvent,
    editEvent,
    deleteEvent,
    loginUser,
    user,
    logoutUser,
    registerAttendee,
    registerSpeaker,
    registerSponsor,
    registerSchedule,
    registerRoomid,
    updateUserIsStaffById,
    addSpeaker,
    addSponsor,
    // getEvent,
    // getUserById,
    eventUsers,
    speakers,
    sponsors,
    attendees,
    loading,
    error,
  };

  return (
    <EventContext.Provider value={contextValue}>
      {children}
    </EventContext.Provider>
  );
};

export { EventProvider, EventContext };
