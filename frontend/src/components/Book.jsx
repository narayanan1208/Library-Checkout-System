import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BooksContext } from "../context/BooksContext";

function Book(props) {
  const { id, title, quantity, year, author, description, photoUrl } = props;
  const [buy, setBuy] = useState(false);
  const { loginResult, bookDataDetails, setBookDataDetails, addBookData } =
    useContext(BooksContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (buy) {
      const fetchData = async () => {
        try {
          if (bookDataDetails.user_id) {
            await addBookData();
          }
        } catch (error) {
          console.error("Error adding book data:", error);
        }
      };

      fetchData();
      setBuy(false);
    }
  }, [buy]);

  const handleBookPurchase = async () => {
    if (!loginResult.success) {
      // If not logged in, show a tooltip or message and return
      alert("Please log in to buy this book."); // You can use a tooltip library here for a nicer UI
      return;
    }

    setBuy(true);

    setBookDataDetails({
      user_id: loginResult["user_data"][0],
      book_name: title,
      book_id: id,
      penalty: 0,
    });
  };

  return (
    <div className="book-container bg-light border">
      <div>Title: {title}</div>
      <div>Author: {author}</div>
      <div>Quantity: {quantity}</div>
      <div className="book-container-button">
        <Link to={`/${id}`}>
          <button className="btn btn-secondary">View</button>
        </Link>
        <Link>
          <button className="btn btn-secondary" onClick={handleBookPurchase}>
            Buy
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Book;
