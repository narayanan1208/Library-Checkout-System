import psycopg2

def get_data(cursor):
    try:
        cursor.execute('SELECT * FROM "books"')
        data = cursor.fetchall()

        return {"success": data, "message": "Book details successfully fetched"}

    except psycopg2.Error as e:
        error_message = "Database error: " + str(e)
        return {"success": False, "error": error_message}

def get_all_user_details(cursor):
    try:
        cursor.execute('SELECT * FROM "user_credentials"')
        data = cursor.fetchall()

        return {"success": True, "user_data": data}

    except psycopg2.Error as e:
        error_message = "Database error: " + str(e)
        return {"success": False, "error": error_message}

def get_all_user_book_data(cursor):
    try:
        cursor.execute('SELECT * FROM "user_book_data"')
        data = cursor.fetchall()

        return {"success": True, "user_data": data}

    except psycopg2.Error as e:
        error_message = "Database error: " + str(e)
        return {"success": False, "error": error_message}

def add_user_to_credentials(cursor, name, username, password):
    try:
        cursor.execute('''
            INSERT INTO "user_credentials" ("Name","Username", "Password") VALUES (%s, %s, %s);
        ''', (name, username, password))

        cursor.connection.commit()

        return {"success": True, "message": "User added successfully"}

    except psycopg2.Error as e:
        error_message = "Database error: " + str(e)
        return {"success": False, "error": error_message}

def check_user_credentials(cursor, username, password):
    try:
        cursor.execute('''
            SELECT * FROM "user_credentials" WHERE "Username" = %s AND "Password" = %s;
        ''', (username, password))

        result = cursor.fetchone()

        if result:
            return {"success": True, "message": "Login successful", "user_data": result}
        else:
            return {"success": False, "message": "Invalid username or password"}
    except psycopg2.Error as e:
        error_message = "Database error: " + str(e)
        return {"success": False, "error": error_message}

def add_user_book_data(cursor, user_id, book_id, book_name, borrow_date, penalty_fee):
    try:
        cursor.execute('SELECT "quantity" FROM "books" WHERE "book_id" = %s;', (book_id,))
        quantity = cursor.fetchone()

        if quantity and quantity[0] > 0:
            # Check if quantity is already 0, set it to 0 to prevent negative values
            updated_quantity = max(quantity[0] - 1, 0)

            cursor.execute('UPDATE "books" SET "quantity" = %s WHERE "book_id" = %s;', (updated_quantity, book_id))
            cursor.execute('''
                INSERT INTO "user_book_data" ("UserID", "BookID", "BookBorrowed", "BorrowedDate", "PenaltyAmount")
                VALUES (%s, %s, %s, %s, %s);
            ''', (user_id, book_id, book_name, borrow_date, penalty_fee))

            cursor.connection.commit()

            return {"success": True, "message": "Book borrowed data added successfully"}

        return {"success": False, "error": "Book is not available"}

    except psycopg2.Error as e:
        error_message = "Database error: " + str(e)
        return {"success": False, "error": error_message}


def return_book(cursor, id, book_id):
    try:
        cursor.execute('SELECT COUNT(*) FROM "user_book_data" WHERE "BorrowingID" = %s;',
                       (id,))
        count = cursor.fetchone()

        if count and count[0] > 0:
            cursor.execute('UPDATE "books" SET "quantity" = "quantity" + 1 WHERE "book_id" = %s;', (book_id,))
            cursor.execute('DELETE FROM "user_book_data" WHERE "BorrowingID" = %s;', (id,))  # Delete the record

            cursor.connection.commit()

            return {"success": True, "message": "Book returned successfully"}

        return {"success": False, "error": "Book not found in user's borrowed books"}

    except psycopg2.Error as e:
        error_message = "Database error: " + str(e)
        return {"success": False, "error": error_message}
