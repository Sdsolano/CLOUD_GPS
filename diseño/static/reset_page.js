let map;
let marker;
let polyline = null;

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
        fixed: true
    });

    // Crea la polilínea en el mapa
    polyline = new google.maps.Polyline({
        map: marker, // Solo se llama una vez
        fixed: true,
        strokeOpacity: 0.8,
        strokeWeight: 5,
        strokeColor: '#0000FF',
        smoothFactor: 0.9
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
                    var firstRow = response[0];
                    var firstLatitude = parseFloat(firstRow.Latitude);
                    var firstLongitude = parseFloat(firstRow.Longitude);

                    if (!isNaN(firstLatitude) && !isNaN(firstLongitude)) {
                        // Actualiza la posición del marcador con las coordenadas de la primera fila
                        marker.setPosition(new google.maps.LatLng(firstLatitude, firstLongitude));

                        // Centra el mapa en la ubicación de la primera fila
                        map.setCenter(new google.maps.LatLng(firstLatitude, firstLongitude));

                        // Agrega las coordenadas de cada punto al final de la polilínea
                        polyline.setPath(response.map(row => new google.maps.LatLng(row.Latitude, row.Longitude)));
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

$(document).ready(function () {   
    setInterval(reloadTable, 7000);
});






