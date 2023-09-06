let map;
let marker;

function initMap() {
    // Inicializa el mapa dentro de esta función
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
}

function reloadTable() {
    $.ajax({
        url: "/components",
        method: "GET",
        success: function (response) {
            if (typeof google !== 'undefined' && typeof google.maps !== 'undefined') {
                // Verifica si la API de Google Maps se ha cargado correctamente

                if (!map) {
                    // Si el mapa aún no se ha inicializado, llama a initMap
                    initMap();
                }

                // Actualiza la tabla
                var tablaHTML = "<table>";
                tablaHTML += "<thead><tr><th>ID</th><th>Latitude</th><th>Longitude</th><th>Time_stamp</th></tr></thead>";
                tablaHTML += "<tbody>";

                if (response.length > 0) {
                    var lastRow = response[response.length - 1];
                    var lastLatitude = parseFloat(lastRow.Latitude);
                    var lastLongitude = parseFloat(lastRow.Longitude);

                    response.forEach(function(row) {
                        tablaHTML += "<tr><td>" + row.ID + "</td><td>" + row.Latitude + "</td><td>" + row.Longitude +  "</td><td>" + row.Time_stamp + "</td></tr>";
                    });

                    tablaHTML += "</tbody></table>";

                    $("#tabla-contenido").html(tablaHTML);

                    if (!isNaN(lastLatitude) && !isNaN(lastLongitude)) {
                        // Actualiza la posición del marcador
                        marker.setPosition(new google.maps.LatLng(lastLatitude, lastLongitude));
                        map.setCenter(new google.maps.LatLng(lastLatitude, lastLongitude));
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
    // Llama a reloadTable al cargar la página
    reloadTable();

    // Establece un intervalo para actualizar el mapa y el marcador cada 67 segundos
    setInterval(reloadTable, 7000);
});
