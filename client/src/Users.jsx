import React, { useContext, useEffect, useState } from "react";
import { EventContext } from "./MyContext";
import { FaEllipsisH } from "react-icons/fa";
import { Link } from "react-router-dom";

function Users() {
  const [attendeeUsers, setAttendeeUsers] = useState([]);
  const { attendees } = useContext(EventContext);

  // Fetch initial user data from Attendees
  useEffect(() => {
    setAttendeeUsers(attendees || []);
  }, [attendees]);

  const handleAddAdmin = async () => {};

  return (
    <div>
      <table className="table caption-top rounded mt-2 bg-white">
        <caption className="text-dark fs-4">Attendees</caption>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Company</th>
          </tr>
        </thead>
        <tbody>
          {attendeeUsers && attendeeUsers.length > 0 ? (
            attendeeUsers.map((user) => (
              <tr key={user.id}>
                <th scope="row">{user.id}</th>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.company}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                No attendees found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {/* <Link to="/users/add" className="btn btn-success fw-bold">
        <i className="bi bi-plus-circle"></i> Add User
      </Link> */}
    </div>
  );
}

export default Users;
