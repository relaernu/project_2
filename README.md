# project_2

1. preparation
    (1) download current victoria Crash Stats dataset:
        https://vicroadsopendatastorehouse.vicroads.vic.gov.au/opendata/Road_Safety/ACCIDENT.zip

    (2) dataset metadata:
        https://data.vicroads.vic.gov.au/Metadata/Crash%20Stats%20-%20Data%20Extract%20-%20Open%20Data.html

    (3) VIC Suburb/Locality Boundaries geojson:
        https://data.gov.au/geoserver/vic-suburb-locality-boundaries-psma-administrative-boundaries/wfs?request=GetFeature&typeName=ckan_af33dd8c_0534_4e18_9245_fc64440f742e&outputFormat=json

    (4) unzip and put following files into path static/data/:
        ACCIDENT.csv            -- Accident records
        ACCIDENT_LOCATION.csv   -- Accident location info
        ACCIDENT_EVENT.csv      -- Accident event details
        NODE.csv                -- Accident location belongs to which node
        PERSON.csv              -- Accident people detail
        VEHICLE.csv             -- Accident vehicle detail
        ATMOSPHERIC_COND.csv    -- Weather condition
        features.json           -- Suburb boundaries geojson

    (5) create file database.py as follow (for database install on local machine, <ip> = localhost):

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

    (4) Accident event type

    (5) Weather condition when accident happened

    (6) Accident map 

