from flask import Flask, render_template, request, jsonify
import mysql.connector
from mysql.connector import Error
import datetime
import pytz

app = Flask(__name__)

# Define la zona horaria de Bogotá
bogota_timezone = pytz.timezone('America/Bogota')

def database_connect():
    try:
        connection = mysql.connector.connect(
            host='gps-data.cfum7svn09as.us-east-2.rds.amazonaws.com',
            user='admin',
            password='TioRico2209-',
            database='proyecto1_diseño'
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

            # Decodifica el timestamp Unix Epoch en milisegundos a la zona horaria de Bogotá
            for row in result:
                timestamp_ms = row['Time_stamp']
                if timestamp_ms is not None:
                    timestamp_s = timestamp_ms / 1000.0  # Convierte milisegundos a segundos
                    timestamp = datetime.datetime.fromtimestamp(timestamp_s, pytz.utc)
                    timestamp = timestamp.astimezone(bogota_timezone)
                    # Elimina la diferencia horaria en el formato de cadena
                    row['Time_stamp'] = timestamp.strftime('%Y-%m-%d %H:%M:%S')

            return jsonify(result)
        else:
            return "Database unreachable"
    except Exception as e:
        return "Error " + str(e)

@app.route('/')
def index():
    return render_template("index.html")

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=80)
