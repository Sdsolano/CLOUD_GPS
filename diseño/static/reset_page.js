var map;
var marker;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 0, lng: 0 }, // Centro del mapa inicial
        minZoom: 5,
        maxZoom: 10, 
    });
    actualizarDatos(); // Llama a la función para cargar los datos y el mapa inicialmente
}

function actualizarDatos() {
    $.ajax({
        url: "/components",
        method: "GET",
        success: function (respuesta) {
            if (respuesta.length > 0) {
                // Obtener solo el primer elemento de la respuesta
                var primeraCoordenada = respuesta[0];

                // Limpiar marcador existente
                if (marker) {
                    marker.setMap(null);
                }

                // Marcar el mapa con la primera coordenada
                marker = new google.maps.Marker({
                    position: { lat: parseFloat(primeraCoordenada.Latitude), lng: parseFloat(primeraCoordenada.Longitude) },
                    map: map,
                    title: "Ubicación " + primeraCoordenada.ID
                });

                // Centrar el mapa en la primera coordenada
                map.setCenter(marker.getPosition());

                // Actualizar el contenido del div "tabla-contenido" solo con la primera fila
                var tablaHTML = "<table><thead><tr><th>ID</th><th>Latitud</th><th>Longitud</th><th>Timestamp</th></tr></thead><tbody>";
                tablaHTML += "<tr><td>" + primeraCoordenada.ID + "</td><td>" + primeraCoordenada.Latitude + "</td><td>" + primeraCoordenada.Longitude + "</td><td>" + primeraCoordenada.Time_stamp + "</td></tr>";
                tablaHTML += "</tbody></table>";
                $("#tabla-contenido").html(tablaHTML);
            }

            // Llamar a la función nuevamente después de 5 segundos (5000 milisegundos)
            setTimeout(actualizarDatos, 5000);
        }
    });
}

// Llama a la función initMap al cargar la página
google.maps.event.addDomListener(window, 'load', initMap);
