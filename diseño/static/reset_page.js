let map;
let marker;
let polyline;

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

    // Crea una polilínea vacía
    polyline = new google.maps.Polyline({
        path: [],
        geodesic: true,
        strokeColor: '#FF0000', // Color de la línea (rojo en este caso)
        strokeOpacity: 1.0,
        strokeWeight: 2
    });

    // Asigna la polilínea al mapa
    polyline.setMap(map);

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
                    var path = response.map(row => new google.maps.LatLng(parseFloat(row.Latitude), parseFloat(row.Longitude)));

                    // Agrega las coordenadas al array de la polilínea
                    polyline.getPath().push(...path);

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


