import { useState } from "react";
import Nav from "./Nav";
import Events from "./Events";
import Dashboard from "./Dashboard";
import CreateEvent from "./CreateEvent";
import Users from "./Users";
import Speakers from "./Speakers";
import Sponsors from "./Sponsors";
import EventDetail from "./EventDetail";
import EventSpeaker from "./EventSpeaker";
import AddSpeaker from "./AddSpeaker";
import Sidebar from "./Sidebar";
import EventAttendee from "./EventAttendee";
import AddAttendee from "./AddAttendee";
import EventSponsor from "./EventSponsor";
import AddSponsor from "./AddSponsor";
import EventSchedule from "./EventSchedule";
import AddSchedule from "./AddSchedule";
import UpdateEvent from "./UpdateEvent";
import Room from "./Room";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Sharelink from "./Sharelink";

function Home() {
  const [toggle, setTottle] = useState(true);
  const Toggle = () => {
    setTottle(!toggle);
  };

  return (
    <div className="container-fluid bg-white min-vh-100 overflow-hidden">
      <div className="row">
        {toggle && (
          <div className="col-4 col-md-2 bg-black vh-100 position-fixed">
            <Sidebar />
          </div>
        )}
        {toggle && <div className="col-4 col-md-2"></div>}
        <div className="col">
          <div className="dash-background px-3">
            <Nav Toggle={Toggle} />
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:id" element={<EventDetail />} />
              <Route path="/events/:id/attendees" element={<EventAttendee />} />
              <Route
                path="/events/:id/attendees/add"
                element={<AddAttendee />}
              />
              <Route path="/events/:id/speakers" element={<EventSpeaker />} />
              <Route path="/events/:id/speakers/add" element={<AddSpeaker />} />
              <Route path="/events/:id/sponsors" element={<EventSponsor />} />
              <Route path="/events/:id/sponsors/add" element={<AddSponsor />} />
              <Route path="/events/:id/schedules" element={<EventSchedule />} />
              <Route
                path="/events/:id/schedules/add"
                element={<AddSchedule />}
              />
              <Route path="/events/create" element={<CreateEvent />} />
              <Route path="/events/:id/update" element={<UpdateEvent />} />

              <Route path="/users" element={<Users />} />
              <Route path="/speakers" element={<Speakers />} />
              <Route path="/sponsors" element={<Sponsors />} />
              <Route path="/room/:id" element={<Room />} />
              <Route path="/sharelink/:id" element={<Sharelink />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
