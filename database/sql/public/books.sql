CREATE TABLE books
(
    "book_id" serial PRIMARY KEY,
    "book_name" varchar(255) UNIQUE NOT NULL,
    "quantity" integer NOT NULL,
    "year_of_publication" integer NOT NULL,
    "author" varchar(255) NOT NULL,
    "description" text,
    "cover_photo_url" varchar(255)
);

INSERT INTO books ("book_id", "book_name", "quantity", "year_of_publication", "author", "description", "cover_photo_url")
VALUES
(1, 'Harry Potter and the Philosopher''s Stone', 10, 1997, 'J. K. Rowling', 'Harry Potter and the Philosopher''s Stone is a fantasy novel written by British author J. K. Rowling', 'https://m.media-amazon.com/images/I/81S0LnPGGUL._AC_UF1000,1000_QL80_.jpg'),
(2, 'The Great Gatsby', 10, 1925, ' F. Scott Fitzgerald', 'The Great Gatsby is a 1925 novel by American writer F. Scott Fitzgerald.', 'https://m.media-amazon.com/images/I/81S0LnPGGUL._AC_UF1000,1000_QL80_.jpg'),
(3, 'To Kill a Mockingbird', 10, 1960, 'Harper Lee', 'To Kill a Mockingbird is a novel by the American author Harper Lee. It was published in 1960 and was instantly successful.', 'https://m.media-amazon.com/images/I/81S0LnPGGUL._AC_UF1000,1000_QL80_.jpg'),
(4, 'Adventures of Huckleberry Finn', 10, 1884, 'Mark Twain', 'Adventures of Huckleberry Finn is a novel by American author Mark Twain', 'https://m.media-amazon.com/images/I/81S0LnPGGUL._AC_UF1000,1000_QL80_.jpg'),
(5, 'One Hundred Years of Solitude' , 10, 1967, 'Gabriel García Márquez', 'One Hundred Years of Solitude is a 1967 novel by Colombian author Gabriel García Márquez that tells the multi-generational story of the Buendía family, whose patriarch, José Arcadio Buendía, founded the fictitious town of Macondo.', 'https://m.media-amazon.com/images/I/81S0LnPGGUL._AC_UF1000,1000_QL80_.jpg'),
(6, 'The Catcher in the Rye', 10, 1951, 'J. D. Salinger', 'The Catcher in the Rye is an American novel by J. D. Salinger that was partially published in serial form 1946 before being novelized in 1951', 'https://m.media-amazon.com/images/I/81S0LnPGGUL._AC_UF1000,1000_QL80_.jpg'),
(7, 'Jane Eyre', 10, 1847, 'Charlotte Brontë', 'Jane Eyre is a novel by the English writer Charlotte Brontë.', 'https://m.media-amazon.com/images/I/81S0LnPGGUL._AC_UF1000,1000_QL80_.jpg'),
(8, 'Wuthering Heights', 10, 1847, 'Emily Brontë', 'Wuthering Heights is the first and only novel by the English author Emily Brontë.', 'https://m.media-amazon.com/images/I/81S0LnPGGUL._AC_UF1000,1000_QL80_.jpg'),
(9, 'Nineteen Eighty-Four', 10, 1949, 'George Orwell', 'Nineteen Eighty-Four is a dystopian social science fiction novel and cautionary tale by English writer George Orwell.', 'https://m.media-amazon.com/images/I/81S0LnPGGUL._AC_UF1000,1000_QL80_.jpg'),
(10, 'Atonement', 10, 2001, 'Ian McEwan', 'Atonement is a 2001 British metafictional novel written by Ian McEwan.', 'https://m.media-amazon.com/images/I/81S0LnPGGUL._AC_UF1000,1000_QL80_.jpg');
