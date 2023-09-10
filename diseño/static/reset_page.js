let map;
let marker;
let polyline;
let smoothedPath = new google.maps.MVCArray(); // Usaremos MVCArray para una polilínea suave
var previousMarkerPosition = null;
let markerAtTip;


function initMap() {
    // Inicializa el mapa
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -0.5, lng: 0.5 }, // Coordenadas iniciales de ejemplo
        position: { lat: -0.5, lng: 0.5 },
        zoom: 15,
        minZoom: 12,
    });

    // Crea el marcador en el mapa
    marker = new google.maps.Marker({
       position: { lat: -0.5, lng: 0.5 }, // Coordenadas iniciales de ejemplo
       position: { lat: -0.5, lng: 0.5 },
        map: map,
        title: "Mi Marcador"
    });

    // Crea una polilínea suave con MVCArray
    polyline = new google.maps.Polyline({
        position: { lat: -0.5, lng: 0.5 }, // Coordenadas iniciales de ejemplo
        position: { lat: -0.5, lng: 0.5 },
        path: smoothedPath,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2,
        map: map,
    });

    markerAtTip = new google.maps.Marker({
        position: { lat: -0.5, lng: 0.5 }, // Coordenadas iniciales de ejemplo
        center: { lat: -0.5, lng: 0.5 }, // Coordenadas iniciales de ejemplo

        map: map,
        icon: {
            path: google.maps.SymbolPath.CIRCLE, // Usa un símbolo circular como marcador
            scale: 20, // Tamaño del marcador
            fillColor: '#FF0000', // Color de relleno del marcador
            fillOpacity: 1, // Opacidad del relleno
            strokeWeight: 0 // Sin borde
        }
    });

    // Carga la tabla y actualiza el mapa
    reloadTable();
    loadCoordinatesFromDatabase();
    loadPolylineFromLocalStorage();

    google.maps.event.addListener(map, 'center_changed', function() {
        marker.setPosition(map.getCenter());
    });
    

    
}

function savePolylineToLocalStorage() {
    var polylineArray = smoothedPath.getArray().map(function (latLng) {
        return { lat: latLng.lat(), lng: latLng.lng() };
    });
    localStorage.setItem('polyline', JSON.stringify(polylineArray));
}

// Carga la polilínea desde el almacenamiento local
function loadPolylineFromLocalStorage() {
    var polylineArray = JSON.parse(localStorage.getItem('polyline'));
    if (Array.isArray(polylineArray)) {
        smoothedPath.clear();
        polylineArray.forEach(function (coord) {
            smoothedPath.push(new google.maps.LatLng(coord.lat, coord.lng));
        });
    }
}

function loadCoordinatesFromDatabase() {
    $.ajax({
        url: "/components", // Reemplaza esto con la URL correcta de tu servidor
        method: "GET",
        success: function (response) {
            if (Array.isArray(response) && response.length > 0) {
                // Limpia la polilínea existente antes de cargar nuevas coordenadas
                smoothedPath.clear();

                // Recorre las coordenadas y agrégalas a la polilínea
                response.forEach(function (coord) {
                    smoothedPath.push(new google.maps.LatLng(coord.lat, coord.lng));
                });

                // Mueve el marcador al último punto de la polilínea
                if (smoothedPath.getLength() > 0) {
                    markerAtTip.setPosition(smoothedPath.getAt(smoothedPath.getLength() - 1));
                }
            }
        },
        error: function (xhr, status, error) {
            console.error("Error al cargar coordenadas desde la base de datos", error);
        }
    });


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

                        // Centra el mapa en la ubicación de la primera fila
                        map.setCenter(new google.maps.LatLng(firstLatitude, firstLongitude));

                        // Actualiza la posición del marcador con las coordenadas de la primera fila
                        marker.setPosition(new google.maps.LatLng(firstLatitude, firstLongitude));

                        // Agrega la nueva posición a la polilínea suave
                        
                        smoothedPath.push(new google.maps.LatLng(firstLatitude, firstLongitude));
                        markerAtTip.setPosition(smoothedPath.getAt(smoothedPath.getLength() - 1));


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
