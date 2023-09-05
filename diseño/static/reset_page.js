var map;
var marker;

function initializeMap(latitude, longitude) {
    map = L.map('map').setView([latitude, longitude], 16);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(map);

    marker = L.marker([latitude, longitude], { rotationAngle: 0 }).addTo(map)
        .bindPopup('Last Location!')
        .openPopup();
    marker.setRotationAngle(0);

    // Fija la posición del marcador en las coordenadas deseadas
    map.on('move', function() {
        marker.setLatLng([latitude, longitude]);
    });
}

function reloadTable() {
    $.ajax({
        url: "/components",
        method: "GET",
        success: function(response) {
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
                if (!map) {
                    initializeMap(lastLocation.Latitude, lastLocation.Longitude);
                } else {
                    latitude = lastLocation.Latitude;
                    longitude = lastLocation.Longitude;
                    marker.setLatLng([latitude, longitude]);
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
