## System Requirements
1) Python: version 3.8.5 or above 
2) Pandas: version 1.2.3 or above 
3) psycopg2: 2.8.6 or above 
4) SQLAlchemy: 1.3.22 or above 
5) Flask: 1.1.2 or above 
6) mysqlclient: 2.0.3 or above (only for using mysql database only)


## Instructions  
    1. Git pull the project folder. 

    2. Download crash stats from https://discover.data.vic.gov.au/dataset/crash-stats-data-extract.

![Alt text](images/data.png?raw=true "data")

    3. Unzip the downloaded folder and copy the files into ..\project_2\static\data.

![Alt text](images/downloaded.PNG?raw=true "downloaded")

    4. Go to https://data.gov.au/geoserver/vic-local-government-areas-psma-administrative-boundaries/wfs?request=GetFeature&typeName=ckan_bdf92691_c6fe_42b9_a0e2_a4cd716fa811&outputFormat=json and save as features.json to  ..\project_2\static\data.

![Alt text](images/features.PNG?raw=true "features")

    5. Create a settings.py file and include the required information (ip, username, password, port) for postgresSQL or mySQL. Update your current_database (mysql or postgresql) in line 23. 

![Alt text](images/settings.PNG?raw=true "settings")

    6. Save settings.py to ..\project_2.

![Alt text](images/settings2.PNG?raw=true "settings")

    7. In PostgreSQL, create a database and name it “viccrash”. 

![Alt text](images/postgresql.PNG?raw=true "postgresql")

    8. Create a config.js file and include the following information with your API key.

![Alt text](images/config.PNG?raw=true "config")

    9. Save config.js  to ..\static\js.

![Alt text](images/config2.PNG?raw=true "config2")

    10. Open gitbash/terminal and run “conda activate PythonData”. Then run “python app.py” to run flask server. 

    11. Navigate to http://localhost:5000/importdata (windows user) or http://127.0.0.1:5000/importdata (mac user) to import data. 

![Alt text](images/importdata.png?raw=true "importdata")

    12. Navigate to http://promenu.com.au:5000/ to view the project dashboard. 

    13. Click on the unique buttons to view visualisations and pages.
