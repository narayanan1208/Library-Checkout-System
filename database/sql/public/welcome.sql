CREATE TABLE welcome
(
    "WelcomeID" serial PRIMARY KEY,
    "Message" text NOT NULL,
    "MessageCode" text UNIQUE NOT NULL,
    "CreatedAt" timestamp default now()
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;


