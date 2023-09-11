var map;
var marker;

function initMap() {
    // Inicializa el mapa
    map = L.map('map').setView([10.0, -74.0], 13);
    map.setView([10.0, -74.0]);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Crea el marcador en el mapa
    marker = L.marker([10.0, -74.0]).addTo(map);
    

    // Carga la tabla y actualiza el mapa
    reloadTable();
}

function reloadTable() {
    $.ajax({
        url: "/components",
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
                var coords = [parseFloat(response[0].Latitude), parseFloat(response[0].Longitude)];

                // Actualiza la posición del marcador con las coordenadas de la primera fila
                marker.setLatLng(coords);
                map.setView([parseFloat(response[0].Latitude),  parseFloat(response[0].Longitude]);
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
