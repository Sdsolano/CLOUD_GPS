let map;
let marker;
let polylines = []; // Arreglo para almacenar polilíneas
let previousMarkerPosition = null; // Variable para la posición anterior del marcador

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

                // Actualiza la tabla con los últimos tres datos
                var tablaHTML = "<table>";
                tablaHTML += "<thead><tr><th>ID</th><th>Latitude</th><th>Longitude</th><th>Time_stamp</th></tr></thead>";
                tablaHTML += "<tbody>";
                for (var i = 0; i < Math.min(response.length, 3); i++) {
                    var row = response[i];
                    tablaHTML += "<tr><td>" + row.ID + "</td><td>" + row.Latitude + "</td><td>" + row.Longitude +  "</td><td>" + row.Time_stamp + "</td></tr>";
                }
                tablaHTML += "</tbody></table>";

                $("#tabla-contenido").html(tablaHTML);

                if (response.length > 0) {
                    var latestCoordinate = new google.maps.LatLng(parseFloat(response[0].Latitude), parseFloat(response[0].Longitude));

                    // Mueve el marcador a la última coordenada
                    marker.setPosition(latestCoordinate);

                    // Crea una nueva polilínea con la última coordenada
                    var newPolyline = new google.maps.Polyline({
                        path: previousMarkerPosition ? [previousMarkerPosition, latestCoordinate] : [latestCoordinate],
                        geodesic: true,
                        strokeColor: '#FF0000', // Color de la línea
                        strokeOpacity: 1.0,
                        strokeWeight: 2
                    });

                    // Agrega la nueva polilínea al mapa
                    newPolyline.setMap(map);

                    // Agrega la nueva polilínea al arreglo de polilíneas
                    polylines.push(newPolyline);

                    // Actualiza la posición anterior del marcador
                    previousMarkerPosition = latestCoordinate;

                    // Centra el mapa en la última coordenada
                    map.setCenter(latestCoordinate);
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
