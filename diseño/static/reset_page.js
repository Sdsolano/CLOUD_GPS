var map; // Declara una variable global para el mapa
var marker; // Declara una variable global para el marcador

function initializeMap(latitude, longitude) {
    // Crea el mapa y centra en las coordenadas
    map = L.map('map').setView([latitude, longitude], 16);
    
    // Agrega una capa de azulejos de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(map);

    // Agrega un marcador en las coordenadas
    marker = L.marker([latitude, longitude], { draggable: true, rotationAngle: 0 }).addTo(map)
        .bindPopup('Last Location!')
        .openPopup();

    // Establece la rotación del marcador en 0 grados (norte)
    marker.setRotationAngle(0);

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
            if (response.length > 0) {
                var lastLocation = response[0];
                // Si el mapa no se ha inicializado, inicialízalo
                if (!map) {
                    initializeMap(lastLocation.Latitude, lastLocation.Longitude);
                } else {
                    // Actualiza la posición del marcador
                    marker.setLatLng([lastLocation.Latitude, lastLocation.Longitude]);

                    // Calcula el ángulo de rotación del marcador (si es necesario)
                    // Esto depende de la dirección en la que deseas que apunte el marcador
                    // Por ejemplo, si quieres que apunte hacia el norte, usa 0 grados
                    // Si quieres que apunte hacia el este, usa 90 grados, etc.
                    var rotationAngle = 0; // Ajusta el ángulo según tus necesidades
                    marker.setRotationAngle(rotationAngle);
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
