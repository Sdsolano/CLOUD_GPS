let map;
let marker;
let polyline; // Variable para la polilínea
let markerCoordinates = []; // Almacena las coordenadas del marcador
let isPolylineDrawn = false; // Bandera para verificar si se ha dibujado la polilínea

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

    // Inicializa una polilínea vacía en el mapa
    polyline = new google.maps.Polyline({
        path: [], // Inicialmente vacío
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2,
        map: map,
    });

    // Configura el evento clic en el botón para dibujar la polilínea
    $("#polylineDraw").click(function() {
        drawPolyline();
    });

    // Carga la tabla y actualiza el mapa
    reloadTable();
}

function drawPolyline() {
    if (!isPolylineDrawn) {
        // Verifica si la polilínea ya ha sido dibujada
        polyline.setPath(markerCoordinates);
        isPolylineDrawn = true;
    }
}

function reloadTable() {
    $.ajax({
        url: "/components",
        method: "GET",
        success: function (response) {
            if (typeof google !== 'undefined' && typeof google.maps !== 'undefined') {
                // Verifica si la API de Google Maps se ha cargado

                // Actualiza la tabla con los últimos datos
                var tablaHTML = "<table>";
                tablaHTML += "<thead><tr><th>ID</th><th>Latitude</th><th>Longitude</th><th>Time_stamp</th></tr></thead>";
                tablaHTML += "<tbody>";
                for (var i = 0; i < response.length; i++) {
                    var row = response[i];
                    tablaHTML += "<tr><td>" + row.ID + "</td><td>" + row.Latitude + "</td><td>" + row.Longitude + "</td><td>" + row.Time_stamp + "</td></tr>";
                    var latitude = parseFloat(row.Latitude);
                    var longitude = parseFloat(row.Longitude);

                    // Añade coordenadas a la polilínea
                    if (!isNaN(latitude) && !isNaN(longitude)) {
                        markerCoordinates.push(new google.maps.LatLng(latitude, longitude));
                    }
                }
                tablaHTML += "</tbody></table>";

                $("#tabla-contenido").html(tablaHTML);

                if (response.length > 0) {
                    var lastRow = response[response.length - 1];
                    var lastLatitude = parseFloat(lastRow.Latitude);
                    var lastLongitude = parseFloat(lastRow.Longitude);

                    if (!isNaN(lastLatitude) && !isNaN(lastLongitude)) {
                        // Actualiza la posición del marcador con las coordenadas del último dato
                        marker.setPosition(new google.maps.LatLng(lastLatitude, lastLongitude));

                        // Centra el mapa en la ubicación del último dato
                        map.setCenter(new google.maps.LatLng(lastLatitude, lastLongitude));

                        // Si la polilínea ya se ha dibujado, añade la nueva coordenada al final de la polilínea
                        if (isPolylineDrawn) {
                            polyline.getPath().push(new google.maps.LatLng(lastLatitude, lastLongitude));
                        }
                    } else {
                        console.error("Las coordenadas del último dato no son números válidos.");
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

    // Configura el intervalo para actualizar la tabla y el mapa cada 7 segundos
    setInterval(reloadTable, 7000);
});
