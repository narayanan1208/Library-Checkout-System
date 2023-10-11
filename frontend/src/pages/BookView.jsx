import React, { useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { BooksContext } from "../context/BooksContext";

function BookView() {
  const booksData = useContext(BooksContext);
  const { id } = useParams();

  let bookDetail = Object.values(booksData.booksData).find((book) => {
    return book[0] === parseInt(id);
  });

  // console.log("BOOK DETAILS : ", bookDetail);

  const title = bookDetail[1];
  const quantity = bookDetail[2];
  const year = bookDetail[3];
  const author = bookDetail[4];
  const description = bookDetail[5];
  const photoUrl = bookDetail[6];

  return (
    <div className="container">
      <h1 className="mt-4 mb-3">Book Details</h1>
      <div className="row">
        <div className="col-md-4">
          <img src={photoUrl} alt="Book Cover" className="img-fluid" />
        </div>
        <div className="col-md-8">
          <h2>{title}</h2>
          <p className="text-muted">{author}</p>
          <p>Year: {year}</p>
          <p>{description}</p>
          <Link to="/" className="btn btn-primary">
            Back
          </Link>
        </div>
      </div>
    </div>
  );
}

export default BookView;
