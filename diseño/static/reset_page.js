var map;
var marker;

function initMap() {
    map = L.map('map').setView([0, 0], 10); // Centro del mapa inicial y nivel de zoom

    // Agrega un mapa base de OpenStreetMap (puedes cambiarlo a otro proveedor de mapas)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 15, // Nivel de zoom máximo
        minZoom: 5, // Nivel de zoom mínimo
    }).addTo(map);

    actualizarDatos(); // Llama a la función para cargar los datos y el mapa inicialmente

    // Actualizar la tabla cada 5 segundos (5000 milisegundos)
    setInterval(actualizarDatos, 5000);
}

function actualizarDatos() {
    $.ajax({
        url: "/components",
        method: "GET",
        success: function (respuesta) {
            // Eliminar marcador existente
            if (marker) {
                map.removeLayer(marker);
            }

            if (respuesta.length > 0) {
                // Obtener solo el primer elemento de la respuesta
                var primeraCoordenada = respuesta[0];

                // Marcar el mapa con la primera coordenada
                marker = L.marker([parseFloat(primeraCoordenada.Latitude), parseFloat(primeraCoordenada.Longitude)], {
                    title: "Ubicación " + primeraCoordenada.ID
                }).addTo(map);

                // Centrar el mapa en la primera coordenada
                map.setView([parseFloat(primeraCoordenada.Latitude), parseFloat(primeraCoordenada.Longitude)]);

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
$(document).ready(function () {
    initMap();
});
