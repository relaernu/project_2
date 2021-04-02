import pandas as pd
import numpy as np
from sqlalchemy import create_engine
import json
import database
import os

connstr = database.connectionstrings["postgresql"]

engine = create_engine(f'postgresql://{connstr["username"]}:{connstr["password"]}@localhost/{connstr["database"]}')

# function load data into postgresql
def importdata():
    # load accident to database
    df_accident = pd.read_csv("static/data/ACCIDENT.csv")
    df_accident.set_index("ACCIDENT_NO", inplace=True)

    # convert string to datetime for "ACCIDENTDATE" and "ACCIDENTTIME" column
    df_accident["ACCIDENTDATE"] = df_accident["ACCIDENTDATE"].str.strip()
    df_accident["ACCIDENTDATE"] = pd.to_datetime(df_accident["ACCIDENTDATE"], format='%d/%m/%Y')
    df_accident["ACCIDENTTIME"] = df_accident["ACCIDENTTIME"].str.strip()
    df_accident["ACCIDENTTIME"] = pd.to_datetime(df_accident["ACCIDENTTIME"], format='%H:%M:%S')
    df_accident["ACCIDENTTIME"] = df_accident["ACCIDENTTIME"].dt.time
    
    df_accident.to_sql("Accident", engine, if_exists="replace")

    # load accident_location to database
    df_location = pd.read_csv("static/data/ACCIDENT_LOCATION.csv")
    df_location.set_index("ACCIDENT_NO", inplace=True)
    df_location.to_sql("Location", engine, if_exists="replace")

    # load accident_event to database
    df_event = pd.read_csv("static/data/ACCIDENT_EVENT.csv")
    df_event.set_index(["ACCIDENT_NO", "EVENT_SEQ_NO"], inplace=True)
    df_event.to_sql("Event", engine, if_exists="replace")

    # load node to database
    df_node = pd.read_csv("static/data/NODE.csv")
    df_node.set_index("NODE_ID", inplace=True)
    df_node.to_sql("Node", engine, if_exists="replace")

    # load person to database
    df_person = pd.read_csv("static/data/PERSON.csv")
    df_person.set_index("PERSON_ID", inplace=True)
    df_person.to_sql("Person", engine, if_exists="replace")

    # load vehicle to database
    df_vehicle = pd.read_csv("static/data/VEHICLE.csv")
    df_vehicle .set_index(["ACCIDENT_NO", "VEHICLE_ID"], inplace=True)
    df_vehicle.to_sql("Vehicle", engine, if_exists="replace")

# get total accidents
def accident_total():
    result = engine.execute('SELECT COUNT(*) FROM "Accident"')
    return result.fetchone()[0]
