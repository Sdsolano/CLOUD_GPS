let map;
let marker;
let infoWindow;

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

    // Crea una ventana de información para el marcador
    infoWindow = new google.maps.InfoWindow();
}

function updateMapAndTable(response) {
    if (!map) {
        // Si el mapa aún no se ha inicializado, llama a initMap
        initMap();
    }

    // Actualiza el mapa y el marcador aquí
    if (response.length > 0) {
        var lastRow = response[response.length - 1];
        var lastLatitude = parseFloat(lastRow.Latitude);
        var lastLongitude = parseFloat(lastRow.Longitude);
        var lastTime = parseFloat(lastRow.Time_stamp);

        if (!isNaN(lastLatitude) && !isNaN(lastLongitude)) {
            // Actualiza la posición del marcador
            marker.setPosition(new google.maps.LatLng(lastLatitude, lastLongitude));

            // Centra el mapa en la nueva ubicación
            map.setCenter(new google.maps.LatLng(lastLatitude, lastLongitude));

            // Muestra la información en una ventana de información
            let contenidoMarcador = "Latitude:" + lastLatitude + "<br> Longitude:" + lastLongitude + "<br> Timestamp" + lastTime;
            infoWindow.setContent(contenidoMarcador);
            infoWindow.open(map, marker);
        } else {
            console.error("Las coordenadas no son números válidos.");
        }
    }
}

function reloadTable() {
    $.ajax({
        url: "/components",
        method: "GET",
        success: function (response) {
            if (typeof google !== 'undefined' && typeof google.maps !== 'undefined') {
                // Verifica si la API de Google Maps se ha cargado correctamente

                // Actualiza el mapa y la tabla
                updateMapAndTable(response);

                // Actualiza la tabla
                var tablaHTML = "<table>";
                tablaHTML += "<thead><tr><th>ID</th><th>Latitude</th><th>Longitude</th><th>Time_stamp</th></tr></thead>";
                tablaHTML += "<tbody>";
                response.forEach(function(row) {
                    tablaHTML += "<tr><td>" + row.ID + "</td><td>" + row.Latitude + "</td><td>" + row.Longitude +  "</td><td>" + row.Time_stamp + "</td></tr>";
                });
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
    // Llama a initMap para inicializar el mapa al cargar la página
    initMap();

    // Llama a reloadTable al cargar la página
    reloadTable();

    // Establece un intervalo para actualizar el mapa y el marcador cada 67 segundos
    setInterval(reloadTable, 7000);
});
