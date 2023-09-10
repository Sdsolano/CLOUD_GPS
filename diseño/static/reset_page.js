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

                    // Inicializa el marcador solo en la primera llamada
                    if (!marker) {
                        marker = new google.maps.Marker({
                            position: path[0],
                            map: map,
                            title: "Mi Marcador",
                        });
                    }

                    // Centra el mapa en la ubicación de la primera fila
                    map.setCenter(path[0]);

                    // Inicializa la polilínea solo en la primera llamada
                    if (!polyline) {
                        polyline = new google.maps.Polyline({
                            map: map,
                            strokeOpacity: 0.8,
                            strokeWeight: 5,
                            strokeColor: '#0000FF',
                            clickable: false,
                        });
                    }

                    // Establece el camino de la polilínea sin volver a crearla
                    polyline.setPath(path);
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









