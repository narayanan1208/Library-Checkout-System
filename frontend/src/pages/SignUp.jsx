import React, { useState, useContext } from "react";
import { BooksContext } from '../context/BooksContext';

const SignUp = () => {
    const { signUpCredentials, setSignUpCredentials, signUp } = useContext(BooksContext);
    const [successMessage, setSuccessMessage] = useState("");

    const disableCheck = () => {
        return signUpCredentials.username.trim() === "" || signUpCredentials.password.trim() === "" || signUpCredentials.name.trim() === ""; 
    }

    const handleSignup = async () => {
        if (signUpCredentials.username && signUpCredentials.password && signUpCredentials.name) {
          await signUp();
          setSuccessMessage("Signup successful!");
        } else {
          setSuccessMessage("Please fill out all fields.");
        }
      };

  return (
    <div className="signup-form-container">
        <h2>Signup</h2>
        <input
            className="signup-input"
            type="text"
            placeholder="Name"
            onChange={(e) =>
                setSignUpCredentials({ ...signUpCredentials, name: e.target.value })
        }
        />
        <input
            className="signup-input"
            type="text"
            placeholder="Username"
            onChange={(e) =>
                setSignUpCredentials({ ...signUpCredentials, username: e.target.value })
            }
        />
        <input
            className="signup-input"
            type="password"
            placeholder="Password"
            onChange={(e) =>
                setSignUpCredentials({ ...signUpCredentials, password: e.target.value })
            }
        />
        <button className="signup-button" onClick={handleSignup} disabled={signUpCredentials.username.trim() === "" || signUpCredentials.password.trim() === "" || signUpCredentials.name.trim() === ""}>Sign Up</button>
        <p className="signup-message" >{successMessage}</p>
    </div>
  );
};

export default SignUp;
