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
#holi
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

        try:
            connect = database_connect()
            if connect:
                cursor = connect.cursor(dictionary=True)
                
                # Sentencia SQL para seleccionar las coordenadas y Time_stamp entre las dos fechas en formato Unix Epoch Time en milisegundos
                sql = """
                SELECT Latitude, Longitude, Time_stamp
                FROM datos
                WHERE Time_stamp >= %s AND Time_stamp <= %s
                """
                cursor.execute(sql, (fecha_inicio_unix_ms, fecha_fin_unix_ms))
                result = cursor.fetchall()
                
                cursor.close()
                connect.close()

                for row in result:
                    timestamp_ms = row['Time_stamp']
                    if timestamp_ms is not None:
                        timestamp_s = timestamp_ms / 1000.0  # Convierte milisegundos a segundos
                        timestamp = datetime.datetime.fromtimestamp(timestamp_s, pytz.utc)
                        timestamp = timestamp.astimezone(bogota_timezone)
                        # Elimina la diferencia horaria en el formato de cadena
                        row['Time_stamp'] = timestamp.strftime('%Y-%m-%d %H:%M:%S')
                
                # Crear listas separadas para coordenadas y Time_stamp
                coordenadas = [{"Latitude": row["Latitude"], "Longitude": row["Longitude"]} for row in result]
                time_stamps = [row["Time_stamp"] for row in result]

                # Crear un diccionario de respuesta
                response_data = {
                    "coordenadas": coordenadas,
                    "time_stamps": time_stamps
                }

                # Devuelve la respuesta en formato JSON
                return jsonify(response_data)
            else:
                return "Database unreachable"
        except Exception as e:
            return jsonify({'error': 'Error al obtener coordenadas y Time_stamp: ' + str(e)}), 500







@app.route('/fechas', methods=['GET'])
def buscar_fechas():
    if request.method == 'GET':
        try:
            lat = float(request.args.get('lat'))
            lng = float(request.args.get('lng'))
            radius = float(request.args.get('radius'))

            connect = database_connect()
            if connect:
                cursor = connect.cursor(dictionary=True)
                
                # Consulta SQL para buscar los Time_stamps dentro del área circular
                sql = """
                SELECT Time_stamp
                FROM ubicaciones
                WHERE
                    SQRT(POW(latitud - %s, 2) + POW(longitud - %s, 2)) <= %s
                """
                cursor.execute(sql, (lat, lng, radius))
                results = cursor.fetchall()
                
                cursor.close()
                connect.close()

            # Crea una lista de Time_stamps a partir de los resultados
            time_stamps = [result[0] for result in results]

            # Devuelve los Time_stamps como respuesta en formato JSON
            return jsonify({'time_stamps': time_stamps})

        except Exception as e:
            return jsonify({'error': str(e)}), 500







@app.route('/')
def index():
    return render_template("index.html", google_maps_api_key=GOOGLE_MAPS_API_KEY)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=80)
