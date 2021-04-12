from flask import Flask, request, jsonify, render_template
import settings

# define database to be used ("mysql"|"postgresql")
settings.current_database = "postgresql"
import database

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

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
    result = {}
    rows = None
    if info == "sex":
        rows = database.person_sex()
    elif info == "age":
        rows = database.person_age()
    elif info == "injury":
        rows = database.person_injured()
    for row in rows:
        result[row[info]] = row["total"]
    return jsonify(result)

# vehicle overview
@app.route("/vehicle/<info>")
def get_vehicle(info):
    result = {}
    if info == "type":
        None
    elif info == "color":
        None
    elif info == "make":
        None
    return jsonify(result) 
    
# location overview


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
    app.run(debug=True)