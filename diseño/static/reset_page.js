let map;
let marker;
let polyline; // Variable para la polilínea
let markerCoordinates = []; // Almacena las coordenadas del marcador
let isDrawingPolyline = false; // Bandera para verificar si se está dibujando la polilínea

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

    // Configura el evento clic en el botón "polylineDraw" para iniciar o detener la polilínea
    $("#polylineDraw").click(function() {
        togglePolylineDrawing();
    });

    // Carga la tabla y actualiza el mapa
    reloadTable();
}

function togglePolylineDrawing() {
    isDrawingPolyline = !isDrawingPolyline;
    if (isDrawingPolyline) {
        // Comienza a dibujar la polilínea
        $("#polylineDraw").text("Detener Polilínea");
    } else {
        // Detiene la polilínea
        $("#polylineDraw").text("Iniciar Polilínea");
    }
}

function drawPolyline() {
    // Añade las coordenadas actuales del marcador a la polilínea
    polyline.setPath(markerCoordinates);
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
                    var latitude = parseFloat(row.Latitude);
                    var longitude = parseFloat(row.Longitude);


                    // Añade coordenadas a la polilínea si se está dibujando

                }
                tablaHTML += "</tbody></table>";

                $("#tabla-contenido").html(tablaHTML);

                if (response.length > 0) {
                    var firstRow = response[0];
                    var firstLatitude = parseFloat(firstRow.Latitude);
                    var firstLongitude = parseFloat(firstRow.Longitude);
                    if (isDrawingPolyline && !isNaN(parseFloat(firstRow.Latitude)) && !isNaN(parseFloat(firstRow.Longitude))) {
                        markerCoordinates.push(new google.maps.LatLng(parseFloat(firstRow.Latitude),parseFloat(firstRow.Longitude)));
                        console.log("Coordenadas de la polilínea:", markerCoordinates);

                    }

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
    // Carga la tabla y actualiza el mapa cuando se carga la página
    reloadTable();

    // Configura el intervalo para actualizar la tabla y el mapa cada 7 segundos
    setInterval(reloadTable, 7000);
    
    // Configura un intervalo para actualizar la polilínea cada segundo si está dibujando
    setInterval(function() {
        if (isDrawingPolyline) {
            drawPolyline();
        }
    }, 1000);
});

