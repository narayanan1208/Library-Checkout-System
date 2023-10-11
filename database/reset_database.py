# python3
import logging

logger = logging.getLogger(__name__)

from dbfunctions import create_all_tables
from dbfunctions import get_conn
from dbfunctions import insert_csv_data
from dbfunctions import reset_schema
from functools import partial
import os
import time
from tables_config import public_tables


# (str, str) -> str / Exception
def get_env(env_string, exception_message):
    result = os.environ.get(env_string, None)
    if result is None:
        raise Exception(exception_message)
    return result


def reset(
    conn,
    sql_directory,
    schema,
    tables,
):
    # drop_all_tables(conn, schema, tables)
    reset_schema(conn, schema)  # delete and recreate schema in one transaction
    create_all_tables(conn, sql_directory, tables)  # another transaction

    logger.info(f"SUCCESSFULLY RESET SQL FOR SCHEMA '{schema}'!")


def insert(
    conn,
    csv_directory,
    schema,
    tables,
):

    insert_results = ()
    # loop through table levels in order and build tables
    for i in tables.keys():
        insert_results += tuple(
            map(
                lambda x: insert_csv_data(
                    conn,
                    os.path.join(csv_directory, f'{x}.csv'),
                    schema,
                    x,
                    ignore_missing_files=True,
                ),
                tables[i],
            )
        )

    logger.info(f"SUCCESSFULLY RESET SAMPLE DATA FOR SCHEMA '{schema}'!")

    return insert_results


def create_reset_function(schema, sql_path, csv_path, tables):
    def _reset(reset_fn, insert_fn):
        logger.info(f"Resetting schema '{schema}'...")

        logger.info(f"Resetting tables...")
        reset_result = reset_fn(
            sql_path,
            schema,
            tables,
        )

        logger.info(f"Inserting values...")
        insert_result = insert_fn(
            csv_path,
            schema,
            tables,
        )

        return (reset_result, insert_result)

    return _reset


if __name__ == "__main__":
    import logging

    logger = logging.getLogger(__name__)
    logger.setLevel(logging.DEBUG)
    ch = logging.StreamHandler()
    ch.setLevel(logging.DEBUG)
    formatter = logging.Formatter(
        '%(asctime)s : \t%(levelname)s - %(message)s <%(name)s>'
    )
    ch.setFormatter(formatter)
    logger.addHandler(ch)

    # wait 3 seconds before trying to connect to database for the first time, to give db container a chance to finish loading
    time.sleep(3)

    # str, str -> str | Exception
    def _env(message, variable):
        return get_env(variable, message.format(variable))

    env = partial(_env, "Unable to load environment variable: {}")

    logger.info(f"Loading environment variables...")
    DB_USERNAME = env('POSTGRES_USER')
    DB_PASSWORD = env('POSTGRES_PASSWORD')
    DB = env('POSTGRES_DB')
    DB_HOST = env('POSTGRES_HOST')
    DB_PORT = int(env('POSTGRES_PORT'))

    logger.info("Starting python script...")



    reset_public = create_reset_function(
        'public',
        os.path.join('sql', 'public'),
        os.path.join('csv', 'public'),
        public_tables,
    )


    for i in range(100):
        logger.info("Attempting to reset database...")
        try:
          
            conn = get_conn(
                username=DB_USERNAME,
                password=DB_PASSWORD,
                database=DB,
                host=DB_HOST,
                port=DB_PORT,
            )

            reset_fn = partial(reset, conn)
            insert_fn = partial(insert, conn)

            reset_public(reset_fn, insert_fn)
            # reset_prices(reset_fn, insert_fn)

            break
        except Exception as e:
            logger.exception("Exception occurred while resetting database")
            logger.info("Unable to connect. Sleeping...")
            time.sleep(5)  # sleep 5 seconds and wait for database
