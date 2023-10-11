CREATE TABLE user_book_data
(
    "BorrowingID" serial PRIMARY KEY,
    "UserID" integer NOT NULL,
    "BookID" integer NOT NULL,
    "BookBorrowed" varchar(255),
    "BorrowedDate" date,
    "PenaltyAmount" integer DEFAULT 0
)
WITH (
    OIDS = FALSE
);
