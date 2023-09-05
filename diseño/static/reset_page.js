var map; // Declara una variable global para el mapa
var marker; // Declara una variable global para el marcador

function initializeMap(latitude, longitude) {
    // Crea el mapa y centra en las coordenadas
    map = L.map('map').setView([latitude, longitude], 16);
    
    // Agrega una capa de azulejos de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(map);

    // Agrega un marcador en las coordenadas y deshabilita el arrastre
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
