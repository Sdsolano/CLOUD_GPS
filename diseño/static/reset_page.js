var map;
var marker;

function initMap() {
    // Inicializa el mapa
    map = L.map('map').setView([-0.5, 0.5], 13); // Coordenadas iniciales de ejemplo y nivel de zoom

    // Agrega un mapa base de OpenStreetMap (puedes cambiarlo a otro proveedor de mapas)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 15, // Nivel de zoom máximo
        minZoom: 12, // Nivel de zoom mínimo
    }).addTo(map);

    // Crea el marcador en el mapa con una ubicación inicial
    marker = L.marker([-0.5, 0.5]).addTo(map);
    marker.bindPopup("Mi Marcador"); // Agrega un mensaje emergente al marcador

    // Carga la tabla y actualiza el mapa
    reloadTable();
}

function reloadTable() {
    $.ajax({
        url: "/components", // Reemplaza con la URL correcta para obtener datos
        method: "GET",
        success: function (response) {
            // Actualiza la tabla con los últimos tres datos
            var tablaHTML = "<table>";
            tablaHTML += "<thead><tr><th>ID</th><th>Latitude</th><th>Longitude</th><th>Time_stamp</th></tr></thead>";
            tablaHTML += "<tbody>";
            for (var i = 0; i < Math.min(response.length, 3); i++) {
                var row = response[i];
                tablaHTML += "<tr><td>" + row.ID + "</td><td>" + row.Latitude + "</td><td>" + row.Longitude +  "</td><td>" + row.Time_stamp + "</td></tr>";
            }
            tablaHTML += "</tbody></table>";

            $("#tabla-contenido").html(tablaHTML);

            if (response.length > 0) {
                var primeraCoordenada = response[0];

                // Actualiza la posición del marcador con las coordenadas de la primera fila
                marker.setLatLng([parseFloat(primeraCoordenada.Latitude), parseFloat(primeraCoordenada.Longitude)]);

                // Centra el mapa en la ubicación de la primera fila
                map.setView([parseFloat(primeraCoordenada.Latitude), parseFloat(primeraCoordenada.Longitude)]);

            } else {
                console.error("No se encontraron datos para mostrar en el mapa.");
            }
        },
        error: function (xhr, status, error) {
            console.error("AJAX request failed", error);
        }
    });
}

$(document).ready(function () {   
    initMap(); // Llama a la función initMap para inicializar el mapa
    setInterval(reloadTable, 7000);
});
