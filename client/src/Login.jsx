import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { EventContext } from "./MyContext";
import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { loginUser } = useContext(EventContext);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Static authentication for admin
    if (username.toLowerCase() === "admin" && password === "1234") {
      // Create a mock user object for static login
      const mockUserData = {
        user: {
          username: "admin",
          is_staff: true,
        },
        token: "static-admin-token",
      };
      
      // Store in sessionStorage like the real login does
      sessionStorage.setItem("userData", JSON.stringify(mockUserData));
      
      setTimeout(() => {
        setIsLoading(false);
        navigate("/dashboard", { replace: true });
      }, 500);
      return;
    }

    // Try API login for other users
    const userData = {
      username,
      password,
    };

    const handleSuccess = (logged) => {
      setIsLoading(false);
      navigate("/dashboard", { replace: true });
    };

    const handleError = (errorMessage) => {
      setIsLoading(false);
      setError(errorMessage || "Login failed. Please check your credentials.");
    };

    try {
      await loginUser(userData, handleSuccess, handleError);
    } catch (err) {
      setIsLoading(false);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              className="form-control"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={isLoading}
            />
          </div>

          <button 
            type="submit" 
            className="btn-login"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>

          <div className="login-hint">
            <small className="text-muted">
              Demo: Use <strong>admin</strong> / <strong>1234</strong>
            </small>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
