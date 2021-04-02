import json
from flask import Flask, request, jsonify, render_template
# from flaskext.mysql import MySQL
# import json
import database
import postgresql

app = Flask(__name__)

# for my sql
# constr = database.connectionstrings["mysql"]
# app.config['MYSQL_DATABASE_HOST'] = constr["server"]
# app.config['MYSQL_DATABASE_PORT'] = constr["port"]
# app.config['MYSQL_DATABASE_USER'] = constr["username"]
# app.config['MYSQL_DATABASE_PASSWORD'] = constr["password"]
# app.config['MYSQL_DATABASE_DB'] = constr["database"]
# mysql = MySQL(app)


@app.route("/")
def index():
    return render_template("index.html")

@app.route("/all")
def all():
    return jsonify("")

@app.route("/total")
def total():
    return jsonify({
        "total" : postgresql.accident_total()
    })

# mysql solution
# def total():
#     cur = mysql.get_db().cursor()
#     cur.execute("SELECT COUNT(*) AS Total FROM ACCIDENT")
#     row_headers=[x[0] for x in cur.description]
#     rv = cur.fetchall()
#     json_data=[]
#     for result in rv:
#         json_data.append(dict(zip(row_headers,result)))
# #    return json.dumps(json_data)
#     return jsonify(json_data)

@app.route("/loadpostgresql")
def loadpostgresql():
    postgresql.importdata()
    return jsonify({
        "total" : postgresql.accident_total()
    })

if __name__ == "__main__":
    app.run(debug=True)