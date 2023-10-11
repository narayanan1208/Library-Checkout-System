import { Link } from "react-router-dom";
import { BooksContext } from "../context/BooksContext";
import { useContext } from "react";

const NavBar = () => {
  const { loginResult } = useContext(BooksContext);

  // console.log("loginResult :", loginResult);

  return (
    <div className="navbar p-4 position-fixed shadow ">
      <div>
        <Link to="/" style={{ textDecoration: "none" }}>
          <h2 className=" text-white ">Bibliophile's Paradise</h2>
        </Link>
      </div>
      {!loginResult.success ? (
        <div className="nav-right">
          <Link to="/login" style={{ textDecoration: "none", color: "white" }}>
            Login
          </Link>
          <Link to="/signup" style={{ textDecoration: "none", color: "white" }}>
            Sign Up
          </Link>
        </div>
      ) : (
        <div className="nav-right">
          <Link
            to="/user-account"
            style={{ textDecoration: "none", color: "white" }}
          >
            Account
          </Link>
        </div>
      )}
    </div>
  );
};

export default NavBar;
