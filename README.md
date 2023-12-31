# Take Home Project

A simple Library Checkout System where users can search and borrow books from a library.

## Technical Requirements:

- You may use a front-end JS framework of your choice (React is preferred and pre-configured). A different frontend framework will require setup from scratch.
  - You don’t need to spend too much time with styling (simple and functional styling is fine).
  - You may use a CSS framework like Bootstrap to speed up your styling process.
- On the back-end you must use a Python based web framework to build an API that your front-end app will interact with.
  - You may use Flask, Django or any other python framework of your choice so long as you are able to fulfill the aforementioned re-quirements. Flask is preferred and pre-configugred - using a different framework will require setup from scratch.
- You must use an SQL database (SQLite is fine although postgresSQL is pre-configured and preferred).
- You must use Git for version control and your project should be committed to a Github repository.

## Setup

- Be sure docker is installed and setup properly. https://docs.docker.com/get-docker/
- Open a terminal and test that the docker command is usable by running `docker help`
  - You should see a list of commands output.
- `cd` to the top level of the take home project directory at the same level of the 'docker-compose.yaml' file.
- Execute `docker compose up` and wait for it to finish all the steps. You should see the vite/react output as the last thing to start up.
- You now have a working React frontend, Flask backend and postgresSQL database running and working together.

## Usage
- Access the frontend by going to http://localhost:5173/ in a browser.
- Server additions can be made in the backend/library_app folder.
- Frontend additions can be made in frontend/src folder.
- To add new sql tables with default data you need to do 3 things
  1. Add the table name in the database/tables_config.py file within the public_tables object. If your creating a new table that has a forign key to another table, the new table must be added at a higher level in the dictionary - see example in tables_config.py.
  2. Create the table_name.sql file in the database/sql/public folder
  3. If you want the table to have default data add table_name.csv to the database/csv/public folder.
  - Once you make these additions/changes you must `docker compose down` or ctrl + c in the cmd thats running `docker compose` and then re-run `docker compose up`.

