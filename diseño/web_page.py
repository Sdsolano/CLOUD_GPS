from flask import Flask, render_template, request, jsonify, redirect, url_for, render_template_string
import mysql.connector
from mysql.connector import Error
import time
import datetime
import pytz
import sys
sys.path.append('/home/ubuntu/CLOUD_GPS')

from config import db_config
from config import GOOGLE_MAPS_API_KEY

app = Flask(__name__)

# Define la zona horaria de Bogotá
bogota_timezone = pytz.timezone('America/Bogota')

def database_connect():
    try:
        connection = mysql.connector.connect(**db_config)
        return connection
    except Error as e:
        print("Database unreachable, " + e)
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




@app.route('/historicos', methods=['POST'])
def obtener_valores_historicos():
    if request.method == 'POST':
        fecha_inicio = request.form.get('fecha_inicio')
        fecha_fin = request.form.get('fecha_fin')

        print("Fecha de inicio recibida:", fecha_inicio)
        print("Fecha de fin recibida:", fecha_fin)

        # Convierte las fechas al formato Unix Epoch Time en milisegundos
        try:
            # Define la zona horaria de Bogotá
            bogota_timezone = pytz.timezone('America/Bogota')

            # Convierte las fechas de entrada a objetos datetime con la zona horaria de Bogotá
            fecha_inicio_datetime = bogota_timezone.localize(datetime.datetime.strptime(fecha_inicio, "%Y-%m-%d %H:%M:%S"))
            fecha_fin_datetime = bogota_timezone.localize(datetime.datetime.strptime(fecha_fin, "%Y-%m-%d %H:%M:%S"))

            # Convierte las fechas a segundos Unix Epoch Time
            fecha_inicio_unix_s = int(fecha_inicio_datetime.timestamp())
            fecha_fin_unix_s = int(fecha_fin_datetime.timestamp())
            
            # Multiplica por 1000 para obtener milisegundos
            fecha_inicio_unix_ms = fecha_inicio_unix_s * 1000
            fecha_fin_unix_ms = fecha_fin_unix_s * 1000
        except Exception as e:
            return jsonify({'error': 'Error al convertir las fechas: ' + str(e)}), 400

        print("Fecha de inicio (Unix Epoch Time en milisegundos): " + str(fecha_inicio_unix_ms) + "\n")
        print("Fecha de fin (Unix Epoch Time en milisegundos): " + str(fecha_fin_unix_ms) + "\n")

        # Devuelve una respuesta JSON con las fechas en formato Unix Epoch Time en milisegundos
        return jsonify({'fecha_inicio_unix_ms': fecha_inicio_unix_ms, 'fecha_fin_unix_ms': fecha_fin_unix_ms})



# Database historic search
@app.route('/coordenadas_entre_fechas', methods=['POST'])
def coordenadas_entre_fechas():
    if request.method == 'POST':
        fecha_inicio_unix = request.form.get('fecha_inicio_unix')
        fecha_fin_unix = request.form.get('fecha_fin_unix')

        try:
            connect = database_connect()
            if connect:
                cursor = connect.cursor(dictionary=True)
                
                # Sentencia SQL para seleccionar las coordenadas entre las dos fechas en formato Unix Epoch Time
                sql = """
                SELECT Latitude, Longitude
                FROM datos
                WHERE Time_stamp >= %s AND Time_stamp <= %s
                """
                cursor.execute(sql, (fecha_inicio_unix_ms, fecha_fin_unix_ms))
                result = cursor.fetchall()
                
                cursor.close()
                connect.close()
                print(result)
                
                # Devuelve un arreglo de coordenadas en formato JSON
                return jsonify(result)
            else:
                return "Database unreachable"
        except Exception as e:
            return jsonify({'error': 'Error al obtener coordenadas: ' + str(e)}), 500

@app.route('/')
def index():
    return render_template("index.html", google_maps_api_key=GOOGLE_MAPS_API_KEY)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=80)
