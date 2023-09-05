var map; 
var marker; 

function initializeMap(latitude, longitude) {
    // Crea el mapa centrado en el marcador y no en la ubicación exacta
    map = L.map('map').setView([latitude, longitude], 16);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    marker = L.marker([latitude, longitude]).addTo(map);

    // Desactiva el seguimiento automático de la vista del mapa
    map.setMaxBounds(map.getBounds());
    map.on('drag', function () {
        map.panInsideBounds(map.getBounds(), { animate: false });
    });
}




function reloadTable() {
    $.ajax({
        url: "/components",
        method: "GET",
        success: function(response) {
            // Actualizar la tabla como lo hacías antes
            var tablaHTML = "<table>";
            tablaHTML += "<thead><tr><th>ID</th><th>Latitude</th><th>Longitude</th><th>Time_stamp</th></tr></thead>";
            tablaHTML += "<tbody>";
            response.forEach(function(row) {
                tablaHTML += "<tr><td>" + row.ID + "</td><td>" + row.Latitude + "</td><td>" + row.Longitude + "</td><td>" + row.Time_stamp + "</td></tr>";
            });
            tablaHTML += "</tbody></table>";
            $("#tabla-contenido").html(tablaHTML);

            if (response.length > 0) {
                var lastLocation = response[0];
                // Si el mapa no se ha inicializado, inicialízalo
                if (!map) {
                    initializeMap(lastLocation.Latitude, lastLocation.Longitude);
                } else {
                    // Actualiza la posición del marcador
                    marker.setLatLng([lastLocation.Latitude, lastLocation.Longitude]);
                }
            }
        },
        error: function(xhr, status, error) {
            console.error("AJAX request failed", error);
        }
    });
}




$(document).ready(function() {
    reloadTable();

    setInterval(reloadTable, 7000);
});

