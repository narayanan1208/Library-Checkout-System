# python3
import logging

logger = logging.getLogger(__name__)
import os
import sqlalchemy
import psycopg2
from functools import partial
import time
import csv


def get_engine(
    username,
    password,
    database,
    host,
    port,
):
    return sqlalchemy.create_engine(
        f'postgresql://{username}:{password}@{host}:{port}/{database}',
       
    )


def get_conn(
    username,
    password,
    database,
    host,
    port,
):
    return psycopg2.connect(
        f"dbname='{database}' user='{username}' password='{password}' host='{host}' port={port}"
    )


# psycopg2.connection, str -> str | None
def reset_schema(conn, schema='public'):
    # resp = input(f'Drop and recreate schema {schema}? Are you sure? (y/n): ')

    # if resp == 'y' or resp == 'Y':
    query = f'''
        DROP SCHEMA IF EXISTS {schema} CASCADE;
        CREATE SCHEMA IF NOT EXISTS {schema};
        '''
    logger.info(f"Dropping and recreating schema '{schema}'...\n{query}")

    with conn.cursor() as cur:
        cur.execute(query)

    conn.commit()

    return schema

    # return None


# psycopg2.connection, str, {int: str} -> tuple(str) | None
def create_all_tables(conn, input_dir, tables):
    # create all tables in a single transaction
    # str -> str | Exception
    def _create_table(t):
        with open(os.path.join(input_dir, f'{t}.sql'), 'r') as f:
            query = f.read()
            with conn.cursor() as cur:
                try:
                    cur.execute(query)
                    logger.info(f'Created table: {t}')
                    return t
                except Exception as e:
                    logger.exception(f'Failed to create table: {t}')
                    conn.rollback()
                    raise e

    results = ()
    for k in sorted(tables.keys()):  # loop through table levels in order
        # create all tables in this level and add them to results
        results += tuple(map(_create_table, tables[k]))

    conn.commit()  # commit the transaction if all tables created successfully

    return results


# psycopg2.connection, str, str, str -> int
def insert_csv_data(
    conn,
    filepath,
    schema,
    table,
    ignore_missing_files=False,
):
    # check if file exists, and return None if we're ignoring missing files (otherwise, will throw an error when we try to open the file)
    if not os.path.exists(filepath):
        if ignore_missing_files:
            print(f"Ignoring missing file: {filepath}")
            return None

    # load csv file (columns,) ((data,),)
    with open(filepath) as f:
        print(f"Loading file: {filepath}")
        rows = tuple(csv.reader(f))
        headers = '","'.join(rows[0])
        data = rows[1:]
        print(f"{headers=}")
        print(f"{data=}")

        query = f'''INSERT INTO "{schema}"."{table}" ("{headers}") VALUES ({{}});'''

        with conn.cursor() as cur:
            try:
                # insert all rows as one transaction
                # cur.execute(query, params) will convert params to
                # correct db data type automatically
                results = tuple(
                    map(
                        lambda x: cur.execute(
                            query.format(','.join(('%s' for col in rows[0]))),
                            tuple(y if y != '' else None for y in x),  # replace empty strings with None
                        ),
                        data,
                    )
                )
            except Exception as e:
                logger.exception(f"Failed to insert rows into table {table}")
                conn.rollback()
                raise e

        conn.commit()  # commit the transaction if all tables were loaded successfully

    return table

    pass

