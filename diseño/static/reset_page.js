
let map;
let marker;
let polyline;
let overlay;

function initMap() {
    // Inicializa el mapa
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -0.5, lng: 0.5 }, // Coordenadas iniciales de ejemplo
        zoom: 13,
        minZoom: 12,
    });

    // Crea el marcador en el mapa
    marker = new google.maps.Marker({
        position: { lat: -0.5, lng: 0.5 }, // Coordenadas iniciales de ejemplo
        map: map,
        title: "Mi Marcador",
        fixed:true,
    });

    // Inicializa la capa Overlay para la polilínea
    overlay = new google.maps.OverlayView();
    overlay.draw = function() {}; // Define una función vacía para draw

    // Asigna la capa Overlay al mapa
    overlay.setMap(map);

    // Crea una polilínea vacía
    polyline = new google.maps.Polyline({
        path: [],
        geodesic: true,
        strokeColor: '#FF0000', // Color de la línea (rojo en este caso)
        strokeOpacity: 1.0,
        strokeWeight: 2,
    });

    // Asigna la polilínea a la capa Overlay
    polyline.setMap(overlay);

    // Carga la tabla y actualiza el mapa
    reloadTable();
}

function reloadTable() {
    $.ajax({
        url: "/components",
        method: "GET",
        success: function (response) {
            if (typeof google !== 'undefined' && typeof google.maps !== 'undefined') {
                // Verifica si la API de Google Maps se ha cargado

                if (response.length > 0) {
                    var path = response.map(row => new google.maps.LatLng(parseFloat(row.Latitude), parseFloat(row.Longitude)));

                    // Actualiza las coordenadas de la polilínea sin reemplazar la polilínea
                    polyline.setPath(path);

                    // Actualiza la posición del marcador con las coordenadas de la primera fila
                    marker.setPosition(path[0]);

                    // Centra el mapa en la ubicación de la primera fila
                    map.setCenter(path[0]);
                } else {
                    console.error("No se encontraron datos para mostrar en el mapa.");
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
    initMap(); // Llama a la función initMap para inicializar el mapa
    setInterval(reloadTable, 7000);
});

