let map;
let marker;
let polylinePath = []; // Vector para mantener un registro de las coordenadas de la polilínea
let polyline; // Variable para mantener una referencia a la polilínea en el mapa

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

    // Configura el evento de clic en el mapa para actualizar la polilínea
    map.addListener('click', function(event) {
        // Agrega la posición del clic a las coordenadas de la polilínea
        polylinePath.push(event.latLng);
        // Actualiza la polilínea en el mapa
        polylineDraw();
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
                    // Actualiza el vector de coordenadas con los nuevos datos
                    polylinePath = response.map(row => new google.maps.LatLng(parseFloat(row.Latitude), parseFloat(row.Longitude)));

                    // Actualiza la posición del marcador con las coordenadas de la primera fila
                    marker.setPosition(polylinePath[0]);

                    // Centra el mapa en la ubicación de la primera fila
                    map.setCenter(polylinePath[0]);

                    // Llama a la función polylineDraw cuando haya datos nuevos
                    polylineDraw();
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

// Función para dibujar la polilínea y configurar el zoom mínimo
function polylineDraw() {
    // Verifica que haya coordenadas en el vector 'polylinePath'
    if (polylinePath.length > 0) {
        // Si ya existe una polilínea, elimínala del mapa antes de crear la nueva
        if (polyline) {
            polyline.setMap(null);
        }

        // Crea la polilínea en el mapa con las coordenadas existentes
        polyline = new google.maps.Polyline({
            path: polylinePath,
            strokeColor: "#ff0000",
            strokeWeight: 10,
            map: map,
            geodesic: true,
        });

        // Configura el zoom mínimo en 15
        map.setOptions({ minZoom: 15 });
    }
}

// Configura el evento onclick para el botón con el ID "polylineDraw"
$(document).ready(function () {   
    initMap(); // Llama a la función initMap para inicializar el mapa

    // Configura el evento de clic en el botón para habilitar la polilínea inicialmente
    $("#polylineDraw").click(function() {
        polylineDraw();
    });

    setInterval(reloadTable, 7000);
});
