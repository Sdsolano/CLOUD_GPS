import socket
import mysql.connector
import re
import os

# Configuración de la base de datos
db_config = {
   'host': os.environ.get('DB_HOST'),
   'user': os.environ.get('DB_USER'),
   'password': os.environ.get('DB_PASSWORD'),
   'database': os.environ.get('DB_NAME')
}

# Crear conexión a la base de datos
db_connection = mysql.connector.connect(**db_config)
db_cursor = db_connection.cursor()

def udp_server(host, port):
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    server_socket.bind((host, port))
    print(f"UDP server listening on {host}:{port}")

    while True:
        data, address = server_socket.recvfrom(1024)
        decoded_data = data.decode()
        print(decoded_data)
        parts = decoded_data.split(',')
        print(parts)
        if len(parts) == 3:
            latitud = parts[0]
            longitud = parts[1]
            tiempo = parts[2]

            # Insertar los datos en la base de datos
            sql = "INSERT INTO datos (latitude, longitude, time_stamp) VALUES (%s, %s, %s)"
            values = (latitud, longitud, tiempo)
            db_cursor.execute(sql, values)
            db_connection.commit()
            print("Datos insertados en la base de datos:", latitud, longitud, tiempo)
        else:
            print("Datos en un formato incorrecto")
        
        print(f"Received from {address}: {decoded_data}")
        print("-"*20)

if __name__ == "__main__":
    udp_server("0.0.0.0", 9001)
