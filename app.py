from flask import Flask, request, jsonify, render_template, url_for, json
from sqlalchemy.sql.visitors import ReplacingCloningVisitor
import settings
import os

# define database to be used ("mysql"|"postgresql")
# settings.current_database = "postgresql"
# print(settings.current_database)
import database
import datetime


os.environ.get('DATABASE_URL', '')

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/data")
def data():
    return render_template("tables.html")

@app.route("/overview")
def overview():
    return render_template("overview.html")

@app.route("/data/<table>")
def data_table(table):
    # result = []
    # rows = database.data(table.upper())
    # cols = [x for x in rows.keys()]
    # for row in rows:
    #     record = {}
    #     for col in cols:
    #         # print(type(row[col]))
    #         if isinstance(row[col], datetime.date):
    #             record[col] = row[col].strftime("%m/%d/%Y")
    #         elif isinstance(row[col], datetime.time):
    #             record[col] = row[col].strftime("%H:%M:%S")
    #         else:
    #             record[col] = row[col] 
    #     result.append(record)
    table = database.data(table.upper())
    result = {
        "table" : table
    }
    return jsonify(result)

@app.route("/all")
def all():
    return jsonify("")

@app.route("/total")
def total():
    return jsonify({
        "total" : database.accident_total()
    })

# accidents number overview
@app.route("/total/<period>")
def get_total(period):
    result = []
    rows = None
    if period == "year":
        rows = database.accident_year()
    elif period == "month":
        rows = database.accident_month()
    elif period == "day":
        rows = database.accident_dayofweek()
    elif period == "hour":
        rows = database.accident_time()
    for row in rows:
        result.append({
            period : row[period],
            "total" : row["total"]
        })
#        result[row[period]] = row["total"]
    return jsonify(result)

# person overview
@app.route("/person/<info>")
def get_person(info):
    result = []
    rows = None
    if info == "sex":
        rows = database.person_sex()
    elif info == "age":
        rows = database.person_age()
    elif info == "injury":
        rows = database.person_injured()
    for row in rows:
        result.append({
            info : row[info],
            "total" : row["total"]
        })
    return jsonify(result)

# vehicle overview
@app.route("/vehicle/<info>")
def get_vehicle(info):
    result = []
    rows = None
    if info == "type":
        rows = database.vehicle_type()
    elif info == "color":
        rows = database.vehicle_color()
    elif info == "make":
        rows = database.vehicle_make()
    for row in rows:
        result.append({
            info : row[info],
            "total" : row["total"]
        })
    return jsonify(result) 

# location overview
@app.route("/location")
def get_location():
    result = []
    rows = database.location()
    for row in rows:
        result.append({
            "region" : row["region"],
            "lat" : row["lat"],
            "lon" : row["lon"]
        })
    return jsonify(result)

@app.route("/location/<info>")
def get_locations(info):
    result = []
    rows = None
    if info == "postcode":
        rows = database.location_postcode()
        for row in rows:
            result.append({
                "postcode" : row["postcode"],
                "total" : row["total"]
            })
    elif info == "road":
        rows = database.location_road()
        for row in rows:
            result.append({
                "region" : row["region"],
                "road" : row["road"],
                "total" : row["total"]
            })
    return jsonify(result)

@app.route("/boundaries")
def get_boundaries():
    data = json.load(open("static/data/features.json"))
    return jsonify(data)

# @app.route("/year_total")
# def year_total():
#     result = {}
#     rows = database.accident_year()
#     for row in rows:
#         result[row["year"]] = row["total"]
#     return jsonify(result)

# @app.route("/month_total")
# def month_total():
#     result = {}
#     rows = database.accident_month()
#     for row in rows:
#         result[row["month"]] = row["total"]
#     return jsonify(result)


@app.route("/importdata")
def loadmysql():
    rows = database.importdata()
    return jsonify(rows)

if __name__ == "__main__":
    # app.run(host="0.0.0.0", ssl_context='adhoc',debug=True)
    app.run(host="0.0.0.0", debug=True)
    # app.run(debug=True)