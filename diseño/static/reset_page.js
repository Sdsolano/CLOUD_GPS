var map; // Declara una variable global para el mapa
var marker; // Declara una variable global para el marcador

function initializeMap(latitude, longitude) {
    // Crea el mapa y centra en las coordenadas
    map = L.map('map').setView([latitude, longitude], 16);
    
    // Agrega una capa de azulejos de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(map);
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
                }

                // Actualiza la posición del marcador
                if (!marker) {
                    marker = L.marker([lastLocation.Latitude, lastLocation.Longitude]).addTo(map)
                        .bindPopup('Last Location!')
                        .openPopup();
                } else {
                    marker.setLatLng([lastLocation.Latitude, lastLocation.Longitude]);
                }

                // Calcula el ángulo de rotación del marcador (si es necesario)
                // Esto depende de la dirección en la que deseas que apunte el marcador
                // Por ejemplo, si quieres que apunte hacia el norte, usa 0 grados
                // Si quieres que apunte hacia el este, usa 90 grados, etc.
                var rotationAngle = 0; // Ajusta el ángulo según tus necesidades
                marker.setRotationAngle(rotationAngle);
                
                // Actualiza la tabla como lo hacías antes
                var tablaHTML = "<table>";
                tablaHTML += "<thead><tr><th>ID</th><th>Latitude</th><th>Longitude</th><th>Time_stamp</th></tr></thead>";
                tablaHTML += "<tbody>";
                response.forEach(function(row) {
                    tablaHTML += "<tr><td>" + row.ID + "</td><td>" + row.Latitude + "</td><td>" + row.Longitude + "</td><td>" + row.Time_stamp + "</td></tr>";
                });
                tablaHTML += "</tbody></table>";
                $("#tabla-contenido").html(tablaHTML);
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
