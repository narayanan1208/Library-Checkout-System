CREATE TABLE user_credentials
(
    "UserID" serial PRIMARY KEY,
    "Name" varchar(255) NOT NULL,
    "Username" varchar(255) UNIQUE NOT NULL,
    "Password" varchar(255) NOT NULL
)
WITH (
    OIDS = FALSE
);