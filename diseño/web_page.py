from flask import Flask, render_template, request, jsonify
import mysql.connector
from mysql.connector import Error
import datetime

app = Flask(__name__)


def database_connect():
    try:
        connection = mysql.connector.connect(
            host = "rds-gps.c3uuyu8zhwxj.us-east-2.rds.amazonaws.com",
            user="admin",
            password="TioRico2209-",
            database="proyecto1_diseño"
        )
       
        return connection
    except Error as e:
        print("Database unreachable, " +e)
        return None
    
@app.route('/components', methods=['GET'])
def data():
    try: 
        connect = database_connect()
        if connect:
            cursor = connect.cursor(dictionary=True)
            sql = "SELECT ID, Latitude, Longitude, Time_stamp FROM datos ORDER BY id DESC LIMIT 3" 
            cursor.execute(sql)
            result = cursor.fetchall()
            cursor.close()
            connect.close()

            return jsonify(result)
        else:
            return "Database unreachable"
    except Exception as e:
        return "Error " + str(e)
    


@app.route('/')
def index():
    return render_template("index.html")


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
