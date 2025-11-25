import React, { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { EventContext } from "./MyContext";

const AddSpeaker = () => {
  const [fullname, setFullname] = useState("");
  organization;
  const [organization, setOrganization] = useState("");
  const [role, setRole] = useState("");
  const { registerSpeaker } = useContext(EventContext);

  const location = useLocation();
  const navigate = useNavigate();

  const data = location.state;
  const eventid = data.event.id;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const speakerdata = {
      event: eventid,
      fullname,
      organization,
      role,
    };

    const handleSuccess = (speaker_registered) => {
      navigate(0);
    };
    const handleError = () => {
      alert("register failed");
    };

    registerSpeaker(speakerdata, handleSuccess, handleError);
  };

  return (
    <div className="container text-white">
      <h2>Add Speaker</h2>
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
        <button type="submit" className="btn btn-primary">
          Add Speaker
        </button>
      </form>

      <button
        type="button"
        className="btn btn-success fw-bold"
        data-bs-toggle="modal"
        data-bs-target="#addSpeaker"
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
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalToggleLabel">
                Modal 1
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              Show a second modal and hide this one with the button below.
            </div>
            <div class="modal-footer">
              <button
                class="btn btn-primary"
                data-bs-target="#exampleModalToggle2"
                data-bs-toggle="modal"
              >
                Open second modal
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        class="modal fade"
        id="exampleModalToggle2"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel2"
        tabindex="-1"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalToggleLabel2">
                Modal 2
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              Hide this modal and show the first with the button below.
            </div>
            <div class="modal-footer">
              <button
                class="btn btn-primary"
                data-bs-target="#exampleModalToggle"
                data-bs-toggle="modal"
              >
                Back to first
              </button>
            </div>
          </div>
        </div>
      </div>
      <button
        class="btn btn-primary"
        data-bs-target="#exampleModalToggle"
        data-bs-toggle="modal"
      >
        Open first modal
      </button>
    </div>
  );
};

export default AddSpeaker;
