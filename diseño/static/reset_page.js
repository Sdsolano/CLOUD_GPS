var map;
var marker;
var polylineOptions;
var allCoordinates = [];

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 0, lng: 0 },
        minZoom: 12,
        maxZoom: 20,
        zoom: 10
    });

    // Llama a la función para cargar los datos y el mapa inicialmente
    actualizarDatos();

    // Actualizar la tabla cada 5 segundos (5000 milisegundos)
    setInterval(actualizarDatos, 5000);
}

function actualizarDatos() {
    $.ajax({
        url: "/components",
        method: "GET",
        success: function (respuesta) {
            // Limpiar marcador existente
            if (marker) {
                marker.setMap(null);
            }

            if (respuesta.length > 0) {
                // Obtener todas las coordenadas de la respuesta
                var coordenadas = respuesta.map(function (fila) {
                    return new google.maps.LatLng(parseFloat(fila.Latitude), parseFloat(fila.Longitude));
                });

                // Agregar las coordenadas actuales al arreglo global
                allCoordinates = allCoordinates.concat(coordenadas);

                // Crear una nueva polilínea con todas las coordenadas acumuladas
                if (polyline) {
                    polyline.setPath(allCoordinates);
                } else {
                    polyline = new google.maps.Polyline({
                        path: allCoordinates,
                        strokeColor: "#ff0000",
                        strokeWeight: 10,
                        map: map
                    });
                }

                // Marcar el mapa con la primera coordenada
                marker = new google.maps.Marker({
                    position: coordenadas[0],
                    map: map,
                    title: "Ubicación " + respuesta[0].ID
                });

                // Centrar el mapa en la primera coordenada
                map.setCenter(coordenadas[0]);

                // Construir la tabla con todos los datos de la respuesta JSON
                var tablaHTML = "<table><thead><tr><th>ID</th><th>Latitud</th><th>Longitud</th><th>Timestamp</th></tr></thead><tbody>";

                respuesta.forEach(function (fila) {
                    tablaHTML += "<tr><td>" + fila.ID + "</td><td>" + fila.Latitude + "</td><td>" + fila.Longitude + "</td><td>" + fila.Time_stamp + "</td></tr>";
                });

                tablaHTML += "</tbody></table>";

                // Actualizar el contenido del div "tabla-contenido"
                $("#tabla-contenido").html(tablaHTML);
            }
        }
    });
}

// Llama a la función initMap al cargar la página
google.maps.event.addDomListener(window, 'load', initMap);

