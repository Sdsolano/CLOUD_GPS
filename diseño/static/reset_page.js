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
                    marker.setLatLng([lastLocation.Latitude, lastLocation.Longitude]);
                    var rotationAngle = 0; // Ajusta el ángulo según tus necesidades
                    marker.setRotationAngle(rotationAngle);

                    // Solo cambia el centro del mapa si el marcador está fuera de la vista
                    if (!map.getBounds().contains([lastLocation.Latitude, lastLocation.Longitude])) {
                        map.panTo([lastLocation.Latitude, lastLocation.Longitude]);
                    }
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
