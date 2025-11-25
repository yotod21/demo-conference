import React, { useContext, useState, useRef } from "react";
import { EventContext } from "./MyContext";

function Sponsors() {
  const { sponsors } = useContext(EventContext);
  const [name, setName] = useState("");
  const [level, setLevel] = useState("");
  const [website, setWebsite] = useState("");
  const { addSponsor } = useContext(EventContext);
  const modalRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const sponsorData = { name, level, website };

    const handleSuccess = () => {
      setName("");
      setLevel("");
      setWebsite("");
      // Close modal after successful submission
      if (modalRef.current) {
        const modalElement = modalRef.current;
        // Use Bootstrap 5 modal API if available
        if (window.bootstrap) {
          const modal = window.bootstrap.Modal.getInstance(modalElement);
          if (modal) {
            modal.hide();
          }
        } else {
          // Fallback: manually hide modal
          modalElement.classList.remove('show');
          modalElement.style.display = 'none';
          document.body.classList.remove('modal-open');
          const backdrop = document.querySelector('.modal-backdrop');
          if (backdrop) backdrop.remove();
        }
      }
    };
    const handleError = () => {
      alert("Failed to add sponsor. Please try again.");
    };

    addSponsor(sponsorData, handleSuccess, handleError);
  };

  return (
    <div>
      <table className="table caption-top rounded mt-2 bg-white">
        <caption className="text-dark fs-4">Sponsors</caption>
        <thead>
          <tr>
            <th>ID</th>
            <th>Sponsor Name</th>
            <th>Level</th>
            <th>Website</th>
          </tr>
        </thead>
        <tbody>
          {sponsors.map((sponsor) => (
            <tr key={sponsor.id}>
              <th scope="row">{sponsor.id}</th>
              <td>{sponsor.name}</td>
              <td>{sponsor.level}</td>
              <td>{sponsor.website}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* <a href="/sponsors/add" className="btn btn-success fw-bold">
        <i class="bi bi-plus-circle"></i> Add Sponsor
      </a> */}

      <button
        type="button"
        className="btn btn-success fw-bold"
        data-bs-toggle="modal"
        data-bs-target="#addSponsor"
      >
        <i className="bi bi-plus-circle" /> Add Sponsor
      </button>

      <div
        ref={modalRef}
        className="modal fade"
        id="addSponsor"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                <h3>Add Sponsor</h3>
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
                    <label htmlFor="name" className="form-label">
                      Sponsor Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="level" className="form-label">Level</label>
                    <input
                      type="text"
                      className="form-control"
                      id="level"
                      name="level"
                      value={level}
                      onChange={(e) => setLevel(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="website" className="form-label">Website</label>
                    <input
                      type="url"
                      className="form-control"
                      id="website"
                      name="website"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                    />
                  </div>

                  <div className="d-flex justify-content-end">
                    <button
                      type="button"
                      className="btn btn-secondary me-2"
                      data-bs-dismiss="modal"
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                    >
                      Add Sponsor
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sponsors;
