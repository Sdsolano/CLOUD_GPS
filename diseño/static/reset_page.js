var map; // Declara una variable global para el mapa
var marker; // Declara una variable global para el marcador

function initializeMap(latitude, longitude) {
  
    map = L.map('map').setView([latitude, longitude], 16);
    
  
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(map);

  
    marker = L.marker([latitude, longitude], { draggable: false }).addTo(map)
        .bindPopup('Last Location!')
        .openPopup();
}

function reloadTable() {
    $.ajax({
        url: "/components",
        method: "GET",
        success: function(response) {
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
            // Actualiza la tabla como lo hacías antes
            var tablaHTML = "<table>";
            tablaHTML += "<thead><tr><th>ID</th><th>Latitude</th><th>Longitude</th><th>Time_stamp</th></tr></thead>";
            tablaHTML += "<tbody>";
            response.forEach(function(row) {
                tablaHTML += "<tr><td>" + row.ID + "</td><td>" + row.Latitude + "</td><td>" + row.Longitude + "</td><td>" + row.Time_stamp + "</td></tr>";
            });
            tablaHTML += "</tbody></table>";
            $("#tabla-contenido").html(tablaHTML);
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
