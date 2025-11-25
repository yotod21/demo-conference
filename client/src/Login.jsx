import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { EventContext } from "./MyContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { loginUser } = useContext(EventContext);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const userData = {
      username,
      password,
    };

    const handleSuccess = (logged) => {
      navigate("/dashboard", { replace: true });
    };

    const handleError = () => {
      alert("login failed");
    };

    loginUser(userData, handleSuccess, handleError);
  };

  return (
    <div className="container-fluid bg-secondary d-flex justify-content-center min-vh-100 overflow-hidden">
      <div className="col-6 col-md-6 col-lg-4 mt-5">
        <div className="text-white">
          <h2 className="text-center">Login</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                type="text"
                className="form-control"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary btn-block">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
