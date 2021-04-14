import pandas as pd
import numpy as np
import sqlalchemy
from sqlalchemy import create_engine
import os

from sqlalchemy.sql.expression import null
import settings

print(settings.current_database)

setting = settings.db[settings.current_database]
db = settings.current_database
q = settings.db[settings.current_database]["quote"]

engine = create_engine(f'{setting["dialect"]}://{setting["username"]}:{setting["password"]}@{setting["server"]}/{setting["database"]}')

files = ["ACCIDENT", "ACCIDENT_LOCATION", "ACCIDENT_EVENT", "NODE", "PERSON", "VEHICLE", "ATMOSPHERIC_COND"]

# function load data into postgresql
def importdata():

    rows = {}
    # load accident to database
    for file in files:
        # read csv files
        df = pd.read_csv(f"static/data/{file}.csv")
        # define column type in database for string value
        dtypes = {}
        for x in df.columns:
            if df[x].dtypes == "object":
                # convert object type to string
                df[x] = df[x].astype("string")
                # fill na value with empty string
                df[x] = df[x].fillna("")
                # calculate max lenght for current column
                maxlen = df[x].map(len).max()
                # set column data type to varchar
                dtypes[x] = sqlalchemy.types.VARCHAR(length=maxlen)
        
        # set index for current dataframe
        if file == files[0]:
            df.set_index("ACCIDENT_NO", inplace=True)

            # convert string to date and time type
            df["ACCIDENTDATE"] = df["ACCIDENTDATE"].str.strip()
            df["ACCIDENTDATE"] = pd.to_datetime(df["ACCIDENTDATE"], format='%d/%m/%Y')
            df["ACCIDENTDATE"] = df["ACCIDENTDATE"].dt.date
            df["ACCIDENTTIME"] = df["ACCIDENTTIME"].str.strip()
            df["ACCIDENTTIME"] = pd.to_datetime(df["ACCIDENTTIME"], format='%H:%M:%S')
            df["ACCIDENTTIME"] = df["ACCIDENTTIME"].dt.time
            del dtypes["ACCIDENTDATE"]
            del dtypes["ACCIDENTTIME"]

        elif file == files[1]:
            df.set_index("ACCIDENT_NO", inplace=True)
        elif file == files[2]:
            df.set_index(["ACCIDENT_NO", "EVENT_SEQ_NO"], inplace=True)
        elif file == files[3]:
            df.set_index("NODE_ID", inplace=True)
        elif file == files[4]:
            df.set_index("PERSON_ID", inplace=True)
        elif file == files[5]:
            df.set_index(["ACCIDENT_NO", "VEHICLE_ID"], inplace=True)
        elif file == files[6]:
            df.set_index("ACCIDENT_NO", inplace=True)

        # import to database
        df.to_sql(file, engine, if_exists="replace", dtype=dtypes)
        # after successfully import, get imported rows 
        rows[file] = len(df)
    # return imported rows for each table
    return rows 


# def importdata():
    # load accident to database
    df_accident = pd.read_csv("static/data/ACCIDENT.csv")
    df_accident.set_index("ACCIDENT_NO", inplace=True)

    # convert string to datetime for "ACCIDENTDATE" and "ACCIDENTTIME" column
    df_accident["ACCIDENT_NO"] = df_accident["ACCIDENT_NO"].str.strip()
    df_accident["ACCIDENTDATE"] = df_accident["ACCIDENTDATE"].str.strip()
    df_accident["ACCIDENTDATE"] = pd.to_datetime(df_accident["ACCIDENTDATE"], format='%d/%m/%Y')
    df_accident["ACCIDENTTIME"] = df_accident["ACCIDENTTIME"].str.strip()
    df_accident["ACCIDENTTIME"] = pd.to_datetime(df_accident["ACCIDENTTIME"], format='%H:%M:%S')
    df_accident["ACCIDENTTIME"] = df_accident["ACCIDENTTIME"].dt.time
    
    df_accident.to_sql("Accident", engine, if_exists="replace")

    # load accident_location to database
    df_location = pd.read_csv("static/data/ACCIDENT_LOCATION.csv")
    df_location["ACCIDENT_NO"] = df_location["ACCIDENT_NO"].str.strip()
    df_location.set_index("ACCIDENT_NO", inplace=True)
    df_location.to_sql("Location", engine, if_exists="replace")

    # load accident_event to database
    df_event = pd.read_csv("static/data/ACCIDENT_EVENT.csv")
    df_event["ACCIDENT_NO"] = df_event["ACCIDENT_NO"].str.strip()
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

#### accidents overview ####
# get total accidents
def accident_total():
    result = engine.execute(f'SELECT COUNT(*) FROM {q}ACCIDENT{q}')
    return result.fetchone()[0]

# get total accidents group by year
def accident_year():
    result = None
    if db == "mysql":
        result = engine.execute(f'''SELECT YEAR({q}ACCIDENTDATE{q}) AS {q}year{q}, COUNT(1) AS total FROM {q}ACCIDENT{q}
                GROUP BY {q}year{q} ORDER BY {q}year{q}''')
    elif db == "postgresql":
        result = engine.execute(f'''SELECT EXTRACT(YEAR FROM {q}ACCIDENTDATE{q}) AS {q}year{q}, COUNT(1) AS total FROM {q}ACCIDENT{q}
                GROUP BY {q}year{q} ORDER BY {q}year{q}''')
    return result.fetchall()

# def accident_quarter():
#     result = None

# get total accidents group by month
def accident_month():
    result = None
    if db == "mysql":
        result = engine.execute(f'''SELECT MONTH({q}ACCIDENTDATE{q}) AS {q}month{q}, COUNT(1) AS total FROM {q}ACCIDENT{q}
                            GROUP BY {q}month{q} ORDER BY {q}month{q}''')
    elif db == "postgresql":
        result = engine.execute(f'''SELECT EXTRACT(MONTH FROM {q}ACCIDENTDATE{q}) AS {q}month{q}, COUNT(1) AS total FROM {q}ACCIDENT{q}
                GROUP BY {q}month{q} ORDER BY {q}month{q}''')
    return result.fetchall()

# get total accidents group by day of week
def accident_dayofweek():
    result = engine.execute(f'''SELECT CASE {q}Day Week Description{q}
		WHEN 'Sunday' THEN 0 
		WHEN 'Monday' THEN 1 
		WHEN 'Tuesday' THEN 2
		WHEN 'Wednesday' THEN 3
		WHEN 'Thursday' THEN 4
		WHEN 'Friday' THEN 5
		WHEN 'Saturday' THEN 6 END AS {q}day{q}, COUNT(1) AS total FROM {q}ACCIDENT{q}
        GROUP BY {q}day{q} ORDER BY {q}day{q}''')
    return result.fetchall()

# total accidents group by hour of day
def accident_time():
    result = None
    if db == "mysql":
        result = engine.execute(f'''SELECT HOUR({q}ACCIDENTTIME{q}) AS {q}hour{q}, COUNT(1) AS total FROM {q}ACCIDENT{q}
                GROUP BY {q}hour{q} ORDER BY {q}hour{q}''')
    elif db == "postgresql":
        result = engine.execute(f'''SELECT EXTRACT(HOUR FROM {q}ACCIDENTTIME{q}) AS {q}hour{q}, COUNT(1) AS total FROM {q}ACCIDENT{q}
                GROUP BY {q}hour{q} ORDER BY {q}hour{q}''')
    return result
#### End of total overview

#### Person over view (focus on Drivers and Motorcyclists only)
def person_age():
    result = engine.execute(f'''SELECT {q}Age Group{q} AS age, COUNT(1) AS total FROM {q}PERSON{q}
                WHERE ({q}Road User Type Desc{q} = 'Drivers' OR {q}Road User Type Desc{q} = 'Motorcyclists') AND {q}AGE{q} >= 16
                            GROUP BY {q}Age Group{q}''')
    return result
    
def person_sex():
    result = engine.execute(f'''SELECT {q}SEX{q} AS sex, COUNT(1) total FROM {q}PERSON{q}
                WHERE ({q}Road User Type Desc{q} = 'Drivers' OR {q}Road User Type Desc{q} = 'Motorcyclists') AND {q}AGE{q} >= 16
                GROUP BY {q}SEX{q}''')
    return result

# for all persons involed in the accidents
def person_injured():
    result = engine.execute(f'''SELECT {q}Inj Level Desc{q} AS injury, COUNT(1) AS total FROM {q}PERSON{q}
                GROUP BY injury''')
    return result
### Injure level
### 4	Not injured
### 3	Other injury
### 2	Serious injury
### 1	Fatality

def location():
    result = engine.execute(f'''SELECT {q}LGA_NAME{q} AS , {q}Lat{q}, {q}Long{q} FROM {q}NODE{q}''')
    return result




#### vehicle overview



#### weather condition overview
