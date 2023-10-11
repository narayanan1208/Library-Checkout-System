import { useContext, useState, useEffect } from "react";
import Book from "../components/Book";
import { BooksContext } from "../context/BooksContext";
import { Spinner } from "react-bootstrap";

function Homepage() {
  let booksData = useContext(BooksContext);
  const [searchBook, setSearchBook] = useState("");
  const [filteredBooks, setFilteredBooks] = useState([]);

  useEffect(() => {
    // Check if booksData is defined and has the booksData property
    if (booksData && booksData.booksData) {
      const filtered = booksData.booksData
        .filter((book) => {
          return book[1].toLowerCase().includes(searchBook.toLowerCase());
        })
        .sort((a, b) => a[0] - b[0]);
      setFilteredBooks(filtered);
    }
  }, [booksData, searchBook]);

  if (!booksData || !booksData.booksData) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status" />
      </div>
    );
  }

  // console.log("BOOK DATA : ", booksData.booksData);

  return (
    <div>
      <div className="homepage-container ">
        <div className="w-25">
          <input
            className="mt-5 w-100 p-2 rounded"
            placeholder="search"
            onChange={(e) => setSearchBook(e.target.value)}
            value={searchBook}
          />
        </div>
        {filteredBooks.map((book, index) => (
          <Book
            key={index} // Using the book ID as the key
            id={book[0]} // Index 0: Book id
            title={book[1]} // Index 1: Title of the book
            quantity={book[2]} // Index 2: No of books
            year={book[3]} // Index 3: year of Publication
            author={book[4]} // Index 4: Author's name
            description={book[5]} // Index 5: Book description
            photoUrl={book[6]} // Index 6: Photo url
          />
        ))}
      </div>
    </div>
  );
}

export default Homepage;
