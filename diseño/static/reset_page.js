var map;
var marker;
var polyline;
var coordenadas = [];

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 0, lng: 0 }, // Centro del mapa inicial
        minZoom: 12, // Nivel de zoom mínimo (ajusta este valor según tus necesidades)
        maxZoom: 20, // Nivel de zoom máximo (aumentado a 20 para permitir más zoom)
        zoom: 10 // Nivel de zoom inicial
    });
    polyline = new google.maps.Polyline({
        path: [],
        strokeColor: "#FF0000",
        strokeOpacity: 1.0,
        strokeWeight: 2
    });
    polyline.setMap(map);
    actualizarDatos(); // Llama a la función para cargar los datos y el mapa inicialmente

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
                // Obtener solo el primer elemento de la respuesta
                var primeraCoordenada = respuesta[0];

                // Marcar el mapa con la primera coordenada
                marker = new google.maps.Marker({
                    position: { lat: parseFloat(primeraCoordenada.Latitude), lng: parseFloat(primeraCoordenada.Longitude) },
                    map: map,
                    title: "Ubicación " + primeraCoordenada.ID
                });

                // Agregar la coordenada a la polilínea y mantener un registro
                var path = polyline.getPath();
                path.push(marker.getPosition());
                coordenadas.push(marker.getPosition());

                // Centrar el mapa en la primera coordenada
                map.setCenter(marker.getPosition());

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
