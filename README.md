# project_2

# preparation
1. download current victoria Crash Stats dataset:
    https://vicroadsopendatastorehouse.vicroads.vic.gov.au/opendata/Road_Safety/ACCIDENT.zip

2. dataset metadata:
    https://data.vicroads.vic.gov.au/Metadata/Crash%20Stats%20-%20Data%20Extract%20-%20Open%20Data.html

3. unzip and put following files into path static/data/:
    ACCIDENT.csv            -- Accident records
    ACCIDENT_LOCATION.csv   -- Accident location info
    ACCIDENT_EVENT.csv      -- Accident event details
    NODE.csv                -- Accident location belongs to which node
    PERSON.csv              -- Accident people detail
    VEHICLE.csv             -- Accident vehicle detail

4. create file database.py as follow (for database install on local machine, <ip> = localhost):

    db = {
        "mysql" : {
            "server" : "<ip>",
            "username" : "<user>",
            "password" : "<pwd>",
            "database" : "<database>",
            "port" : <port>,    #default 3306
            "dialect" : "mysql+mysqldb",
            "quote" : "`"
        },
        "postgresql" : {
            "server" : "<ip>",
            "username" : "<user>",
            "password" : "<pwd>",
            "database" : "<database>",
            "port" : <port>,    #default 5432
            "dialect" : "postgresql",
            "quote" : '"'
        }
    }

    global current_database     # to define a global variable so we can switch the database used
    current_database = ""

# load data to postgresql
5. activate python environment:
    source activate PythonData

6. run flask server:
    python app.py

7. navigate to the web address:
    http://localhost:5000/importdata

# after step 7 successfully done
8. retrive results
    (1) total accident
        http://localhost:5000/total

    (2) accident by year
        http://localhost:5000/year_total

