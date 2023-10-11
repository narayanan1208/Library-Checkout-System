import React, { useContext } from "react";
import { BooksContext } from "../context/BooksContext";
import { Navigate } from "react-router-dom";

const LoginPage = () => {
  const {
    loginCredentials,
    setLoginCredentials,
    checkLogin,
    loginResult,
    setLoginResult,
  } = useContext(BooksContext);

  const handleLogin = async () => {
    if (loginCredentials.username && loginCredentials.password) {
      await checkLogin();
    } else {
      setLoginResult({
        success: false,
        message: "Please fill out all fields.",
      });
    }
  };

  return (
    <div className="signup-form-container">
      <h2>Login</h2>
      <input
        type="text"
        className="signup-input"
        placeholder="Username"
        value={loginCredentials.username}
        onChange={(e) =>
          setLoginCredentials({ ...loginCredentials, username: e.target.value })
        }
      />
      <input
        type="password"
        className="signup-input"
        placeholder="Password"
        value={loginCredentials.password}
        onChange={(e) =>
          setLoginCredentials({ ...loginCredentials, password: e.target.value })
        }
      />
      <button className="btn btn-primary" onClick={handleLogin}>
        Login
      </button>
      <p className="signup-message">
        {loginResult.success ? (
          <Navigate to="/user-account" />
        ) : (
          loginResult.message
        )}
      </p>
    </div>
  );
};

export default LoginPage;
