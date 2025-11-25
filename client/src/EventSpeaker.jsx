import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { apiGet, apiPost } from "./api";
import { EventContext } from "./MyContext";
import { demoSpeakers } from "./demoData";

const EventSpeaker = () => {
  const [fullname, setFullname] = useState("");
  const [organization, setOrganization] = useState("");
  const [role, setRole] = useState("");
  const { registerSpeaker } = useContext(EventContext);
  const { speakers } = useContext(EventContext);
  const [selectedSpeakerId, setSelectedSpeakerId] = useState("");
  console.log(speakers);

  const location = useLocation();
  const data = location.state;
  const [eventSpeakers, setEventSpeakers] = useState([]);
  console.log(eventSpeakers);
  console.log(data);
  const eventId = data.event.id;
  console.log(eventId);

  const navigate = useNavigate();

  const handleSelectChange = (e) => {
    setSelectedSpeakerId(e.target.value);
  };
  const selectedSpeakerIdNumber = parseInt(selectedSpeakerId, 10);
  const selectedSpeaker = speakers.find(
    (speaker) => speaker.id === selectedSpeakerIdNumber
  );
  console.log(selectedSpeaker);

  const handleSelectSubmit = async (e) => {
    e.preventDefault();

    const speakerdata = {
      fullname: selectedSpeaker.fullname,
      organization: selectedSpeaker.organization,
      role: selectedSpeaker.role,
    };

    const handleSuccess = (speaker_registered) => {
      navigate("/events");
    };
    const handleError = () => {
      alert("register failed");
    };

    try {
      const created = await apiPost(`/api/events/${eventId}/speakers`, speakerdata);
      setEventSpeakers((prev) => [...prev, created]);
      handleSuccess();
    } catch (e) { handleError(); }

    // if (selectedSpeakerId) {
    //   alert(`Selected Speaker ID: ${selectedSpeakerId}`);
    //   // Perform your desired action with the selected speaker ID here
    // } else {
    //   alert("Please select a speaker.");
    // }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const speakerdata = { fullname, organization, role };

    const handleSuccess = (speaker_registered) => {
      setFullname("");
      setOrganization("");
      setRole("");
      navigate("/events");
    };
    const handleError = () => {
      alert("register failed");
    };

    try {
      const created = await apiPost(`/api/events/${eventId}/speakers`, speakerdata);
      setEventSpeakers((prev) => [...prev, created]);
      handleSuccess();
    } catch (e) { handleError(); }
  };

  React.useEffect(() => {
    (async () => {
      try {
        const items = await apiGet(`/api/events/${eventId}/speakers`);
        if (items && items.length > 0) {
          setEventSpeakers(items);
        } else {
          // Use demo data as fallback
          setEventSpeakers(demoSpeakers.slice(0, 3)); // Show first 3 speakers as demo
        }
      } catch (e) {
        // Use demo data as fallback on error
        console.log('Using demo speakers data');
        setEventSpeakers(demoSpeakers.slice(0, 3)); // Show first 3 speakers as demo
      }
    })();
  }, [eventId]);

  return (
    <div>
      <table className="table caption-top rounded mt-2 bg-white">
        <caption className="text-black fs-4">Speakers</caption>
        <thead>
          <tr>
            <th>ID</th>
            <th>Full Name</th>
            <th>Organization</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {eventSpeakers?.map((speaker) => (
            <tr key={speaker.id}>
              <th scope="row">{speaker.id}</th>
              <td>{speaker.fullname}</td>
              <td>{speaker.organization}</td>
              <td>{speaker.role}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Uncomment and update the Link if needed */}
      {/* 
      <Link
        className="btn btn-success fw-bold"
        to={`/events/${location.state.event.id}/speakers/add`}
        state={{ event: location.state.event }}
      >
        <i className="bi bi-plus-circle"></i> Add Speaker
      </Link>
      */}

      <button
        type="button"
        className="btn btn-success fw-bold"
        data-bs-toggle="modal"
        data-bs-target="#exampleModalToggle"
      >
        <i className="bi bi-plus-circle" /> Add Speaker
      </button>
      <div
        class="modal fade"
        id="exampleModalToggle"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel"
        tabindex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalToggleLabel">
                Add Speaker
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <select
                className="form-select"
                aria-label="Default select example"
                value={selectedSpeakerId}
                onChange={handleSelectChange}
              >
                <option value="" disabled>
                  Choose Speaker
                </option>
                {speakers.map((speaker, index) => (
                  <option key={index} value={speaker.id}>
                    {speaker.fullname}
                  </option>
                ))}
              </select>
            </div>
            <div className="modal-footer d-flex justify-content-between">
              <button
                className="btn btn-success"
                data-bs-target="#exampleModalToggle2"
                data-bs-toggle="modal"
              >
                <i className="bi bi-plus-circle" /> Add New
              </button>
              <button
                className="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={handleSelectSubmit}
              >
                Add Speaker
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="exampleModalToggle2"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel2"
        tabindex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalToggleLabel2">
                Modal 2
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="container text-white">
                <form>
                  <div className="mb-3">
                    <label htmlFor="fullname" className="form-label">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="fullname"
                      name="fullname"
                      value={fullname}
                      onChange={(e) => setFullname(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="organization" className="form-label">
                      Organization
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="organization"
                      name="organization"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="role" className="form-label">
                      Role
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="role"
                      name="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      required
                    />
                  </div>
                  <div className="modal-footer d-flex justify-content-between">
                    <button
                      className="btn btn-success"
                      data-bs-target="#exampleModalToggle"
                      data-bs-toggle="modal"
                    >
                      Back
                    </button>
                    <button
                      className="btn btn-primary"
                      data-bs-dismiss="modal"
                      onClick={(e) => {
                        e.preventDefault(); // Prevent default button click behavior
                        handleSubmit();
                      }}
                    >
                      Add
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <div
        className="modal fade"
        id="addSpeaker"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                <h3>Add Speaker</h3>
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <div className="container text-white">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="fullname" className="form-label">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="fullname"
                      name="fullname"
                      value={fullname}
                      onChange={(e) => setFullname(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="organization" className="form-label">
                      Organization
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="organization"
                      name="organization"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="role" className="form-label">
                      Role
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="role"
                      name="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      required
                    />
                  </div>
                  <div class="d-flex justify-content-end">
                    <button
                      type="button"
                      class="btn btn-secondary me-2"
                      data-bs-dismiss="modal"
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      data-bs-dismiss="modal"
                    >
                      Add Speaker
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default EventSpeaker;
