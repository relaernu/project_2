# project_2
0. System Requirements
    (1) Python: version 3.8.5 or above
    (2) Pandas: version 1.2.3 or above
    (3) psycopg2: 2.8.6 or above
    (4) SQLAlchemy: 1.3.22 or above
    (5) Flask: 1.1.2 or above
    (6) mysqlclient: 2.0.3 or above (only for using mysql database only)

1. preparation
    (1) download current victoria Crash Stats dataset:
        https://vicroadsopendatastorehouse.vicroads.vic.gov.au/opendata/Road_Safety/ACCIDENT.zip

    (2) dataset metadata:
        https://data.vicroads.vic.gov.au/Metadata/Crash%20Stats%20-%20Data%20Extract%20-%20Open%20Data.html

    (3) VIC Local Government Boundaries geojson:
        https://data.gov.au/geoserver/vic-local-government-areas-psma-administrative-boundaries/wfs?request=GetFeature&typeName=ckan_bdf92691_c6fe_42b9_a0e2_a4cd716fa811&outputFormat=json

    (4) unzip and put following files into path static/data/:
        ACCIDENT.csv            -- Accident records
        ACCIDENT_LOCATION.csv   -- Accident location info
        ACCIDENT_EVENT.csv      -- Accident event details
        NODE.csv                -- Accident location belongs to which node
        PERSON.csv              -- Accident people detail
        VEHICLE.csv             -- Accident vehicle detail
        ATMOSPHERIC_COND.csv    -- Weather condition
        features.json           -- Local Government geojson (to man)

    (5) create file settings.py as follow (for database install on local machine, <ip> = localhost or 127.0.0.1):

        db = {
            "mysql" : {
                "server" : "<ip>",
                "username" : "<user>",
                "password" : "<pwd>",
                "database" : "<database>",  # create the database before running any codes!!!!
                "port" : <port>,    #default 3306
                "dialect" : "mysql+mysqldb",
                "quote" : "`"
            },
            "postgresql" : {
                "server" : "<ip>",
                "username" : "<user>",
                "password" : "<pwd>",
                "database" : "<database>",  # create the database before running any codes!!!!
                "port" : <port>,    #default 5432
                "dialect" : "postgresql",
                "quote" : '"'
            }
        }

        global current_database     # to define a global variable so we can switch the database used
        current_database = ""
    
    (6) under path "/static/js" create a file "config.js" which include only one line:
        const API_KEY = "<YOUR OpenStreetMap API KEY>";

2. Load data
    (1) choose database by changing the following line in app.py
        settings.current_database = <mysql|postgresql> 
    (2) activate python environment:
        source activate PythonData
    (3) run flask server:
        python app.py
    (4) navigate to the web address:
        http://localhost:5000/importdata

3. Route definition:
    (1) Total accidents group by peroid:
        http://localhost:5000/total/<peroid> # peroid can be <year|month|day|hour>

    (2) Persons involved in accidents group by age, sex and injured level
        http://localhost:5000/person/<age|sex|injury>

    (3) Vehicles involved in accidents group by color, make and type
        http://localhost:5000/vehicle/<color|make|type>

    (4) Accident event type (not in used)
        
    (5) Weather condition when accident happened (not in used)

    (6) Retrive all accident locations
        http://localhost:5000/location

    (7) Retrive top 10 postcode blackspot:
        http://localhost:5000/blackspot 


