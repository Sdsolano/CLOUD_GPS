let map;
let marker;

// Función para inicializar el mapa
function initMap() {
    // Inicializa el mapa dentro de esta función
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -0.5, lng: 0.5 }, // Coordenadas iniciales de ejemplo
        zoom: 13,
        minZoom: 12,
    });

    // Crea el marcador en el mapa (fuera de la función reloadTable)
    marker = new google.maps.Marker({
        position: { lat: -0.5, lng: 0.5 }, // Coordenadas iniciales de ejemplo
        map: map,
        title: "Mi Marcador",
        draggable: false, // Mantén el marcador fijo
    });
}

// Función para actualizar el marcador en el mapa
function updateMarker(latitude, longitude) {
    if (map) {
        // Actualiza la posición del marcador
        marker.setPosition(new google.maps.LatLng(latitude, longitude));
    }
}

function reloadTable() {
    $.ajax({
        url: "/components",
        method: "GET",
        success: function (response) {
            if (typeof google !== 'undefined' && typeof google.maps !== 'undefined') {
                // Verifica si la API de Google Maps se ha cargado

                // Llama a la función para actualizar el mapa y el marcador
                if (response.length > 0) {
                    var lastRow = response[response.length - 1];
                    var lastLatitude = parseFloat(lastRow.Latitude);
                    var lastLongitude = parseFloat(lastRow.Longitude);

                    if (!isNaN(lastLatitude) && !isNaN(lastLongitude)) {
                        // Llama a la función para actualizar el marcador
                        updateMarker(lastLatitude, lastLongitude);
                    } else {
                        console.error("Las coordenadas no son números válidos.");
                    }
                }
            } else {
                console.error("La API de Google Maps no se ha cargado correctamente.");
            }
        },
        error: function (xhr, status, error) {
            console.error("AJAX request failed", error);
        }
    });
}

$(document).ready(function () {
    // Llama a initMap para inicializar el mapa al cargar la página
    initMap();

    // Llama a reloadTable al cargar la página
    reloadTable();

    // Establece un intervalo para actualizar el mapa y el marcador cada 67 segundos
    setInterval(reloadTable, 7000);
});
