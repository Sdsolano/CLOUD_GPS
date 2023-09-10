let map;
let marker;
let polyline = null; // Polilínea inicializada como nula

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
        title: "Mi Marcador"
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
                    tablaHTML += "<tr><td>" + row.ID + "</td><td>" + row.Latitude + "</td><td>" + row.Longitude + "</td><td>" + row.Time_stamp + "</td></tr>";
                }
                tablaHTML += "</tbody></table>";

                $("#tabla-contenido").html(tablaHTML);

                if (response.length > 0) {
                    var firstRow = response[0];
                    var firstLatitude = parseFloat(firstRow.Latitude);
                    var firstLongitude = parseFloat(firstRow.Longitude);

                    if (!isNaN(firstLatitude) && !isNaN(firstLongitude)) {
                        // Actualiza la posición del marcador con las coordenadas de la primera fila
                        var newPosition = new google.maps.LatLng(firstLatitude, firstLongitude);
                        marker.setPosition(newPosition);

                        // Centra el mapa en la ubicación de la primera fila
                        map.setCenter(newPosition);

                        // Crea o actualiza la polilínea
                        updatePolyline(newPosition);
                    } else {
                        console.error("Las coordenadas de la primera fila no son números válidos.");
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

// Función para crear o actualizar la polilínea
function updatePolyline(newPosition) {
    if (!polyline) {
        // Si la polilínea aún no existe, créala
        polyline = new google.maps.Polyline({
            path: [newPosition],
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2,
            map: map,
        });
    } else {
        // Si la polilínea ya existe, agrégale la nueva posición
        var path = polyline.getPath();
        path.push(newPosition);
    }
}

$(document).ready(function () {
    setInterval(reloadTable, 7000);
});
