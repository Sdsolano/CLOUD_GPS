let map;
let marker;
let path = new google.maps.MVCArray(); // Mueve la declaración de 'path' al ámbito global

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
                    // Llama a polylineDraw con las coordenadas de la fila
                    polylineDraw(parseFloat(row.Latitude), parseFloat(row.Longitude));
                }
                tablaHTML += "</tbody></table>";

                $("#tabla-contenido").html(tablaHTML);

                if (response.length > 0) {
                    var coords = new google.maps.LatLng(parseFloat(response[0].Latitude), parseFloat(response[0].Longitude));

                    // Actualiza la posición del marcador con las coordenadas de la primera fila
                    marker.setPosition(coords);

                    // Centra el mapa en las nuevas coordenadas
                    map.setCenter(coords);

                    
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

// Función para dibujar una polilínea con las coordenadas especificadas
function polylineDraw(latitude, longitude) {
    if (isNaN(latitude) || isNaN(longitude)) {
        console.error("Coordenadas inválidas.");
        return;
    }

    var coords = new google.maps.LatLng(latitude, longitude);

    // Agrega la coordenada actual a la polilínea
    path.push(coords);

    // Configura la polilínea en el mapa
    var polyline = new google.maps.Polyline({
        path: path,
        strokeColor: "#ff0000",
        strokeWeight: 10,
        map: map,
        geodesic: true,
    });

    // Aplica un zoom mínimo de 15
    var zoomLevel = map.getZoom();
    if (zoomLevel < 15) {
        map.setZoom(15);
    }
}

// Configura el evento onclick en el botón con el ID "polylineDraw"
$(document).ready(function () {   
    initMap(); // Llama a la función initMap para inicializar el mapa
    $("#polylineDraw").click(function() {
        polylineDraw(parseFloat($("#latitude").val()), parseFloat($("#longitude").val()));
    });
    setInterval(reloadTable, 7000);
});

