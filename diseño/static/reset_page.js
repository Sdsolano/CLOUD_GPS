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
        minZoom: 5,
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
     $("#adjustView").click(function() {
        var markerCurrentPosition = marker.getPosition();
        map.setCenter(markerCurrentPosition);
        map.setZoom(18);
    });

    $("#polylineErase").click(function() {
        erasePolyline();
    });

    // Carga la tabla y actualiza el mapa
    reloadTable();
}

function togglePolylineDrawing() {
    isDrawingPolyline = !isDrawingPolyline;
    if (isDrawingPolyline) {
        // Comienza a dibujar la polilínea
        $("#polylineDraw").text("Stop Polyline");
        
        // Ajusta el zoom mínimo a 19
        map.setOptions({ minZoom: 15 });

        // Restablece las coordenadas del marcador a un arreglo vacío
        markerCoordinates = [];
    } else {
        // Detiene la polilínea
        $("#polylineDraw").text("Draw Polyline");
        
        // Restaura el valor original del zoom mínimo
        map.setOptions({ minZoom: 15 });
    }
}


// Función para mostrar la sección correspondiente según el fragmento de URL o por defecto
function mostrarSeccionDesdeFragmento() {
    var fragment = window.location.hash;
    if (fragment === '#home' || fragment === '') {
        // Mostrar la sección Home
        document.getElementById('home').style.display = 'block';
        document.getElementById('historicos').style.display = 'none'; // Ocultar Históricos
    } else if (fragment === '#historicos') {
        // Mostrar la sección Históricos
        document.getElementById('home').style.display = 'none'; // Ocultar Home
        document.getElementById('historicos').style.display = 'block';
    }
}

<script type="text/javascript">
$("#datetime").datetimepicker({
    format: 'yyyy-mm-dd hh:ii',
    autoclose: true,
    todayBtn: true
});


// Ejecutar la función al cargar la página
window.onload = mostrarSeccionDesdeFragmento;

// Manejar cambios en la URL (por ejemplo, cuando se hace clic en los enlaces de la barra de navegación)
window.onhashchange = mostrarSeccionDesdeFragmento;

function drawPolyline() {
    // Añade las coordenadas actuales del marcador a la polilínea
    polyline.setPath(markerCoordinates);

    // Suaviza la polilínea
    const smoothedPath = google.maps.geometry.spherical.computeSpline(markerCoordinates, 10);

    // Actualiza la polilínea con las coordenadas suavizadas
    polyline.setPath(smoothedPath);
}

function erasePolyline() {
    // Detiene la creación de la polilínea
    isDrawingPolyline = false;
    
    // Restaura el botón de dibujar la polilínea a su estado original
    $("#polylineDraw").text("Draw Polyline");
    
    // Borra las polilíneas existentes
    polyline.setPath([]);
    
    // Establece el zoom mínimo en 13
    map.setOptions({ minZoom: 5 });
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
                }
                tablaHTML += "</tbody></table>";

                $("#tabla-contenido").html(tablaHTML);

                if (response.length > 0) {
                    var firstRow = response[0];
                    var firstLatitude = parseFloat(firstRow.Latitude);
                    var firstLongitude = parseFloat(firstRow.Longitude);
                    
                    // Añade coordenadas a la polilínea si se está dibujando
                    if (isDrawingPolyline && !isNaN(parseFloat(firstRow.Latitude)) && !isNaN(parseFloat(firstRow.Longitude))) {
                        markerCoordinates.push(new google.maps.LatLng(parseFloat(firstRow.Latitude),parseFloat(firstRow.Longitude)));
                    }
                
                    if (!isNaN(firstLatitude) && !isNaN(firstLongitude)) {
                        // Comprueba si las coordenadas han cambiado
                        var markerPosition = marker.getPosition();
                        var newMarkerPosition = new google.maps.LatLng(firstLatitude, firstLongitude);
                        
                        if (!markerPosition.equals(newMarkerPosition)) {
                            // Actualiza la posición del marcador con las coordenadas de la primera fila
                            marker.setPosition(newMarkerPosition);

                            // Centra el mapa en la nueva ubicación del marcador
                            map.setCenter(newMarkerPosition);
                        }
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
    setInterval(reloadTable, 1000);

    // Configura un intervalo para actualizar la polilínea cada segundo si está dibujando
    setInterval(function() {
        if (isDrawingPolyline) {
            drawPolyline();
        }
    }, 1000);
});


