import json
from flask import Flask, request, jsonify, render_template
import settings

# define database to be used ("mysql"|"postgresql")
settings.current_database = "mysql"
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

@app.route("/year_total")
def year_total():
    result = {}
    rows = database.accident_year()
    for row in rows:
        result[row["year"]] = row["total"]
    return jsonify(result)

@app.route("/importdata")
def loadmysql():
    rows = database.importdata()
    return jsonify(rows)

if __name__ == "__main__":
    app.run(debug=True)