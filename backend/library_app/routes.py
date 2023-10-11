from crypt import methods
from library_app import app
from flask import jsonify, request
from flask_cors import cross_origin
import os
from sqlalchemy import create_engine, MetaData
import psycopg2
import traceback
import logging
from backend_functions import add_user_to_credentials, add_user_book_data, return_book, get_data, check_user_credentials, get_all_user_details, get_all_user_book_data
from datetime import datetime


logger = logging.getLogger(__name__)
db_user = os.environ.get('POSTGRES_USER')
db_password = os.environ.get('POSTGRES_PASSWORD')
db_name = os.environ.get('POSTGRES_DB')
db_host = 'database'  
db_port = '5432'

connection_string = f'postgresql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}'

engine = create_engine('postgresql://{un}:{pw}@{host}:{port}/{db}'.format(un=db_user, pw=db_password, db=db_name, host=db_host, port=db_port))
conn = psycopg2.connect("dbname='{db}' user='{un}' password='{pw}' host='{host}' port={port}".format(un=db_user, pw=db_password, db=db_name, host=db_host, port=db_port))
cursor = conn.cursor()

def handle_database_error(e):
    """
    Handle and log database errors with detailed information.
    """
    error_message = str(e)
    traceback_message = traceback.format_exc()  # Get detailed traceback information
    app.logger.error(f"Database error: {error_message}\n{traceback_message}")
    conn.rollback()  # Rollback the transaction
    return {"success": False, "error": error_message}


def initialize_books():
    try:
        sql_script_path = os.path.join('database_sql', 'books.sql')

        sql_folder = os.path.join(os.path.dirname(__file__), 'database')

        relative_sql_path = 'sql/public/books.sql'

        full_sql_path = os.path.join(sql_folder, relative_sql_path)

        with open(full_sql_path, 'r') as sql_file:
            cursor.execute(sql_file.read())
            conn.commit()

        print("Initial book data inserted successfully.")

    except psycopg2.Error as e:
        print("Error initializing book data:", str(e))


@app.route('/')
def hello_world():

    try:
        cursor.execute('''
            SELECT "Message" FROM public.welcome WHERE "MessageCode"='WELCOME_MESSAGE'
        ''')
        row = cursor.fetchone()
        message = row[0]
    except Exception as e:
        message = "Unable to fetch greeting message from database."

    return jsonify(message)


@app.route('/books_details', methods=['GET'])
@cross_origin()
def get_books_details():
    try:
        result = get_data(cursor)

        if result["success"]:
            return jsonify(result)
        # else:
        #     return jsonify({"error": result["error"]})
    except Exception as e:
        return jsonify(handle_database_error(e))


@app.route('/get_all_user_data', methods=['GET'])
@cross_origin()
def get_all_user_data():
    try:
        result = get_all_user_details(cursor)

        if "success" in result:
            if result["success"]:
                return jsonify(result.get("user_data", []))
            else:
                return jsonify({"error": result.get("message", "Unknown error")})
        else:
            return jsonify({"error": "Unknown error"})
    except psycopg2.Error as e:
        return jsonify(handle_database_error(e))


@app.route('/get_all_user_book_data', methods=['GET'])
@cross_origin()
def get_all_user_book_data_route():
    try:
        result = get_all_user_book_data(cursor)

        if "success" in result:
            if result["success"]:
                return jsonify(result.get("user_data", []))
            else:
                return jsonify({"error": result.get("message", "Unknown error")})
        else:
            return jsonify({"error": "Unknown error"})
    except psycopg2.Error as e:
        return jsonify(handle_database_error(e))


@app.route('/add_user', methods=['POST'])
@cross_origin()
def add_user_route():
    try:
        if request.method == 'POST':
            data = request.get_json()
            name = data.get('name')
            username = data.get('username')
            password = data.get('password')

            result = add_user_to_credentials(cursor, name, username, password)

            if result["success"]:
                return jsonify({"message": "User added successfully"})
            else:
                return jsonify({"error": result["error"]})
    except psycopg2.Error as e:
        return jsonify(handle_database_error(e))
   

@app.route('/get_user_credentials', methods=['POST'])
@cross_origin()
def get_user_credentials():
    try:
        if request.method == 'POST':
            data = request.get_json()
            username = data.get('username')
            password = data.get('password')

            result = check_user_credentials(cursor, username, password)

            if result["success"]:
                return jsonify(result), 200  # 200 OK for successful response
            else:
                return jsonify({"error": result["message"]}), 401  # 401 Unauthorized for login failure
    except psycopg2.Error as e:
        # Log the error and return an error response
        app.logger.error(f"Database error: {e}")
        return jsonify({"error": "Database error"}), 500  # 500 Internal Server Error for database error    


@app.route('/add_book', methods=['POST'])
@cross_origin()
def add_book():
    try:
        if request.method == 'POST':
            data = request.get_json()
            user_id = data.get('user_id')
            book_name = data.get('book_name')
            book_id = data.get('book_id')
            borrow_date = datetime.now()
            penalty_fee = int(data.get('penalty'))

            result = add_user_book_data(cursor, user_id, book_id, book_name, borrow_date, penalty_fee)
            
            if result["success"]:
                return jsonify({"message": "User added successfully"})
            else:
                return jsonify({"error": result["error"]})
    except psycopg2.Error as e:
        return jsonify(handle_database_error(e))   


@app.route('/return_book', methods=['DELETE'])
@cross_origin()
def return_book_route():
    try:
        data = request.get_json()
        id = data.get('id')
        book_id = data.get('book_id')

        if not id or not book_id:
            return jsonify({"error": "Both book_id and user_id must be provided in the request."}), 400

        result = return_book(cursor, id, book_id)

        if result["success"]:
            return jsonify({"message": "User added successfully"})
        else:
            return jsonify({"error": result["error"]})
    except Exception as e:
        return jsonify(handle_database_error(e))


if __name__ == '__main__':
    initialize_books()