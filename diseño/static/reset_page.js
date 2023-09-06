let map;
let marker;

function reloadTable() {
    // Define la función initMap dentro de reloadTable
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

    // Verifica si el mapa aún no se ha inicializado, llama a initMap
    if (!map) {
        initMap();
    }

    $.ajax({
        url: "/components",
        method: "GET",
        success: function (response) {
            if (typeof google !== 'undefined' && typeof google.maps !== 'undefined') {
                // Verifica si la API de Google Maps se ha cargado

                // Actualiza la tabla
                var tablaHTML = "<table>";
                tablaHTML += "<thead><tr><th>ID</th><th>Latitude</th><th>Longitude</th><th>Time_stamp</th></tr></thead>";
                tablaHTML += "<tbody>";
                response.forEach(function(row) {
                    tablaHTML += "<tr><td>" + row.ID + "</td><td>" + row.Latitude + "</td><td>" + row.Longitude +  "</td><td>" + row.Time_stamp + "</td></tr>";
                });
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
    initMap();
    reloadTable();

    // Establece un intervalo para actualizar el mapa y el marcador cada 67 segundos
    setInterval(reloadTable, 7000);
});
