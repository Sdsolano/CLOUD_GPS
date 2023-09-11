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
    reloadTableAndMap();
}

function reloadTableAndMap() {
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

                // Actualiza la tabla con los datos de la respuesta AJAX
                var tablaHTML = "<table>";
                tablaHTML += "<thead><tr><th>ID</th><th>Latitude</th><th>Longitude</th><th>Time_stamp</th></tr></thead>";
                tablaHTML += "<tbody>";
                for (var i = 0; i < Math.min(response.length, 3); i++) {
                    var row = response[i];
                    tablaHTML += "<tr><td>" + row.ID + "</td><td>" + row.Latitude + "</td><td>" + row.Longitude +  "</td><td>" + row.Time_stamp + "</td></tr>";
                }
                tablaHTML += "</tbody></table>";

                $("#tabla-contenido").html(tablaHTML);
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
    setInterval(reloadTableAndMap, 7000); // Actualiza tanto la tabla como el mapa
});
