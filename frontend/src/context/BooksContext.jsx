import React, { useState, useEffect, createContext } from "react";

export const BooksContext = createContext();

const BooksProvider = ({ children }) => {
  const [booksData, setBookData] = useState([]);
  const [allUserData, setAllUserData] = useState([]);
  const [allUserBookData, setAllUserBookData] = useState([]);
  const [authToken, setAuthToken] = useState(
    JSON.parse(localStorage.getItem("authToken")) || ""
  );
  const [signUpCredentials, setSignUpCredentials] = useState({
    name: "",
    username: "",
    password: "",
  });

  const [loginCredentials, setLoginCredentials] = useState({
    username: "",
    password: "",
  });

  const [loginResult, setLoginResult] = useState({
    success: false,
    message: "",
  });

  // const [loginResult, setLoginResult] = useState(null);

  const [bookDataDetails, setBookDataDetails] = useState({
    user_id: "",
    book_name: "",
    book_id: "",
    penalty: "",
  });

  const [returnBookDetails, setReturnBookDetails] = useState({
    id: "",
    book_id: "",
  });

  const [pageReloaded, setPageReloaded] = useState(false);

  useEffect(() => {
    fetchAllBookDataResponse();
  }, []);

  useEffect(() => {
    if (window.performance.navigation.type === 1) {
      setPageReloaded(true);
    }

    const fetchLocalStorageData = () => {
      const storedToken = JSON.parse(localStorage.getItem("authToken"));
      // console.log("CRE : ", storedToken);
      if (storedToken) {
        // Set the stored token in your component state
        setAuthToken(storedToken);
        // console.log("USRNAME : ", storedToken["user_data"][2]);
        const usr = storedToken["user_data"][2];
        const pwd = storedToken["user_data"][3];

        setLoginCredentials({
          username: usr,
          password: pwd,
        });
      }
    };

    // Call fetchLocalStorageData once when the component mounts
    fetchLocalStorageData();
  }, []);

  // useEffect(() => {
  //   if (window.performance.navigation.type === 1) {
  //     setPageReloaded(true);
  //   }
  // }, []);

  useEffect(() => {
    if (pageReloaded) {
      // Page has reloaded, handle what you need to do here
      if (loginCredentials.username && loginCredentials.password) {
        // This code will execute when loginCredentials changes
        checkLogin();
      }
      setPageReloaded(false);
    }
  }, [pageReloaded]);

  const fetchAllBookDataResponse = async () => {
    try {
      const response = await fetch("http://localhost:5000/books_details");
      const res = await response.json();
      setBookData(res["success"]);
    } catch (error) {
      console.error("Error fetching book data:", error);
    }
  };

  const fetchAllUserDataResponse = async () => {
    try {
      const response = await fetch("http://localhost:5000/get_all_user_data");
      const res = await response.json();
      // console.log("RES ALL USER DATA : ", res);
      setAllUserData(res);
    } catch (error) {
      console.error("Error fetching book data:", error);
    }
  };

  const fetchAllUserBookDataResponse = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/get_all_user_book_data"
      );
      const res = await response.json();
      setAllUserBookData(res);
    } catch (error) {
      console.error("Error fetching book data:", error);
    }
  };

  const signUp = async () => {
    try {
      const response = await fetch("http://localhost:5000/add_user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signUpCredentials),
      });

      if (response.ok) {
        const result = await response.json();
        // console.log("Signup response:", result);
        fetchAllUserDataResponse();
        fetchAllBookDataResponse(); // Refresh book data
        fetchAllUserBookDataResponse(); // Refresh user book data
      } else {
        console.error("Signup failed");
      }
    } catch (error) {
      console.error("No such login credentials:", error);
    }
  };

  const checkLogin = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/get_user_credentials",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginCredentials),
        }
      );

      if (response.ok) {
        const result = await response.json();
        // console.log("Login response:", result);
        const token = result; // Extract the token
        console.log("Login response token :", token);
        localStorage.setItem("authToken", JSON.stringify(token)); // Store the token in LocalStorage
        console.log(JSON.parse(localStorage.getItem("authToken")));
        setAuthToken(token); // Set the token in your component state
        setLoginResult(result);
        fetchAllUserDataResponse();
        fetchAllBookDataResponse(); // Refresh book data
        fetchAllUserBookDataResponse(); // Refresh user book data
      } else {
        console.error("Login failed");
        setLoginResult({ success: false, message: "Login failed" });
      }
    } catch (error) {
      console.error("Error during login:", error);
      setLoginResult({
        success: false,
        message: "No User Found!! Please Sign Up",
      });
    }
  };

  // console.log("BOOK DATA : ", booksData);

  const bookCount = () => {
    const count = Object.values(allUserBookData).filter(
      (book) => book[1] === bookDataDetails["user_id"]
    );
    return count.length >= 3;
  };

  const addBookData = async () => {
    try {
      const limitChecker = bookCount();
      if (limitChecker) {
        alert("Only Maximum Three Books");
        return;
      }

      const response = await fetch("http://localhost:5000/add_book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookDataDetails),
      });

      if (response.ok) {
        const result = await response.json();
        // console.log(result);
        fetchAllBookDataResponse();
        fetchAllUserBookDataResponse();
      } else {
        console.error("Book details not added");
      }
    } catch (error) {
      console.error("Book details not added:", error);
    }
  };

  const returnBook = async () => {
    try {
      const response = await fetch("http://localhost:5000/return_book", {
        method: "DELETE", // Use DELETE method
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(returnBookDetails), // Ensure that bookDataDetails has 'book_id' and 'user_id'
      });

      if (response.ok) {
        const result = await response.json();
        // console.log("RETURN", result);
        fetchAllBookDataResponse(); // Refresh book data
        fetchAllUserBookDataResponse(); // Refresh user book data
      } else {
        console.error("Book not returned");
      }
    } catch (error) {
      console.error("Book not returned:", error);
    }
  };

  return (
    <BooksContext.Provider
      value={{
        booksData,
        fetchAllUserBookDataResponse,
        fetchAllBookDataResponse,
        fetchAllUserDataResponse,
        allUserData,
        allUserBookData,
        signUpCredentials,
        setSignUpCredentials,
        signUp,
        loginCredentials,
        setLoginCredentials,
        loginResult,
        setLoginResult,
        checkLogin,
        bookDataDetails,
        setBookDataDetails,
        addBookData,
        returnBookDetails,
        setReturnBookDetails,
        returnBook,
        setAuthToken,
      }}
    >
      {children}
    </BooksContext.Provider>
  );
};

export default BooksProvider;
