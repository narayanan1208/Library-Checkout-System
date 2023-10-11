import React, { useContext, useEffect, useState } from "react";
import { Container, Row, Col, Table } from "react-bootstrap";
import { BooksContext } from "../context/BooksContext";
import { useNavigate } from "react-router-dom";

function UserAccount() {
  const {
    allUserBookData,
    loginResult,
    setLoginResult,
    setReturnBookDetails,
    returnBookDetails,
    returnBook,
    setAuthToken,
    logout,
  } = useContext(BooksContext);
  const [returnOption, setReturnOption] = useState(false);
  const navigate = useNavigate();

  // console.log("ALL USER BOOK DATA : ", allUserBookData);

  useEffect(() => {
    if (returnOption) {
      const fetchData = async () => {
        try {
          if (returnBookDetails.id) {
            // console.log("running delete");
            await returnBook();
            // Update the purchasedBooks state after successful return
            updatePurchasedBooks(returnBookDetails.id);
          }
        } catch (error) {
          console.error("Error returning book:", error);
        }
      };

      fetchData();
      setReturnOption(false);
    }
  }, [returnOption]);

  const updatePurchasedBooks = (deletedBookId) => {
    // Filter out the book to be removed
    const updatedPurchasedBooks = purchasedBooks.filter(
      (book) => book[0] !== deletedBookId
    );
    setPurchasedBooks(updatedPurchasedBooks);
  };

  const handleLogout = () => {
    // Perform the logout action here
    localStorage.removeItem("authToken");
    setAuthToken("");
    logout();
    navigate("/login");
  };

  const userAccountID = loginResult?.success ? loginResult["user_data"][0] : "";

  const [purchasedBooks, setPurchasedBooks] = useState(
    allUserBookData?.filter((data) => data[1] === userAccountID) || []
  );

  const handleRemoveBook = (book) => {
    setReturnBookDetails({ id: book[0], book_id: book[2] });
    setReturnOption(true);
  };

  const dateFinder = (dateString, type) => {
    const temp_date = new Date(dateString);

    if (type === "due") {
      // Adding 14 days only if type is "due"
      temp_date.setDate(temp_date.getDate() + 14);
    }

    const day = temp_date.getDate();
    const month = temp_date.toLocaleString("default", { month: "short" });
    const year = temp_date.getFullYear();

    return `${day} ${month} ${year}`;
  };

  const penaltyChecker = (currentDateString) => {
    const tempCurrentDateString = dateFinder(currentDateString, "present");
    const tempDueDateString = dateFinder(currentDateString, "due");
    const currentDate = new Date(tempCurrentDateString);
    const dueDate = new Date(tempDueDateString);

    // Calculate the number of days overdue
    const timeDifferenceInMilliseconds = currentDate - dueDate;
    const daysOverdue = Math.max(
      0,
      Math.floor(timeDifferenceInMilliseconds / (24 * 60 * 60 * 1000))
    );

    // Calculate the penalty amount (1 dollar per day overdue)
    const penaltyAmount = daysOverdue;

    return penaltyAmount;
  };

  return (
    <Container style={{ marginTop: "10rem" }}>
      <div
        className="d-flex justify-content-end align-items-center gap-4  position-absolute "
        style={{ right: "5rem", top: "11rem" }}
      >
        {loginResult?.success && (
          <>
            <h4 className="mr-3">User: {loginResult["user_data"][1]}</h4>
            <button className="btn btn-secondary" onClick={handleLogout}>
              Log out
            </button>
          </>
        )}
      </div>
      <h1>User Account</h1>
      {purchasedBooks.length > 0 && (
        <Row>
          <Col md={10}>
            <h2>Purchased Books</h2>
            <Table bordered hover>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Purchase Date</th>
                  <th>Due Date</th>
                  <th>Penalty</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {purchasedBooks.map((book) => (
                  <tr key={book[0]}>
                    <td>{book[3]}</td>
                    <td>{dateFinder(book[4], "present")}</td>
                    <td
                      style={{
                        backgroundColor:
                          penaltyChecker(book[4]) > 0
                            ? "#ffdf7f"
                            : "transparent",
                      }}
                    >
                      {dateFinder(book[4], "due")}
                    </td>
                    <td
                      style={{
                        backgroundColor:
                          penaltyChecker(book[4]) > 0
                            ? "#ffdf7f"
                            : "transparent",
                      }}
                    >
                      {penaltyChecker(book[4])}
                    </td>

                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleRemoveBook(book)}
                      >
                        Return
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default UserAccount;
