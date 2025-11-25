import React from "react";
import { Link, useLocation } from "react-router-dom";
import { apiGet } from "./api";
import { demoSponsors } from "./demoData";

const EventSponsor = () => {
  const location = useLocation();
  const data = location.state;
  const [sponsors, setSponsors] = React.useState([]);
  const eventId = data.event.id;

  React.useEffect(() => {
    (async () => {
      try {
        const items = await apiGet(`/api/events/${eventId}/sponsors`);
        if (items && items.length > 0) {
          setSponsors(items);
        } else {
          // Use demo data as fallback
          setSponsors(demoSponsors.slice(0, 3)); // Show first 3 sponsors as demo
        }
      } catch (e) {
        // Use demo data as fallback on error
        console.log('Using demo sponsors data');
        setSponsors(demoSponsors.slice(0, 3)); // Show first 3 sponsors as demo
      }
    })();
  }, [eventId]);

  return (
    <div>
      <table className="table caption-top rounded mt-2 bg-white">
        <caption className="text-dark fs-4">Sponsors</caption>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Level</th>
            <th>Website</th>
          </tr>
        </thead>
        <tbody>
          {sponsors.map((sponsor, index) => (
            <tr key={index}>
              <th scope="row">{sponsor.id}</th>
              <td>{sponsor.name}</td>
              <td>{sponsor.level}</td>
              <td>{sponsor.website}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link
        className="btn btn-success fw-bold"
        to={`/events/${data.event.id}/sponsors/add`}
        state={{ event: data.event }}
      >
        <i className="bi bi-plus-circle"></i> Add Sponsor
      </Link>
    </div>
  );
};

export default EventSponsor;
