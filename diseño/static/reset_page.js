let map;
let marker;

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
    });

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
                    // Obtiene las coordenadas geográficas de la primera fila de la respuesta AJAX
                    var firstRow = response[0];
                    var latitude = parseFloat(firstRow.Latitude);
                    var longitude = parseFloat(firstRow.Longitude);

                    // Crea un objeto LatLng con las coordenadas geográficas
                    var firstRowLatLng = new google.maps.LatLng(latitude, longitude);

                    // Actualiza la posición del marcador con las coordenadas geográficas
                    marker.setPosition(firstRowLatLng);

                    // Centra el mapa en la ubicación de las coordenadas geográficas
                    map.setCenter(firstRowLatLng);
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
