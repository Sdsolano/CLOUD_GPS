let map;
let marker;
let polyline;
var previousMarkerPosition = null;

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

    //create an empty path for the polyline
    polyline = new google.maps.Polyline({
        path: [],
        geodesic: true,
        strokeColor: '#FF0000', 
        strokeOpacity: 1.0, 
        strokeWeight: 2,
        map: map,
    })

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
                polyline.setPath([]);
                var smoothedPath=([]);
            

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
                    vr = lastRow = response[response.length - 1];
                    var lastLatitude = parseFloat(lastRow.Latitude);
                    var lastLongitude = parseFloat(lastRow.Longitude);

                    var firstLatitude = parseFloat(firstRow.Latitude);
                    var firstLongitude = parseFloat(firstRow.Longitude);


                    if (!isNaN(lastLatitude) && !isNaN(lasttLongitude)) {
                        // Actualiza la posición del marcador con las coordenadas de la primera fila
                        marker.setPosition(new google.maps.LatLng(lastLatitude, lastLongitude));

                         // Centra el mapa en la ubicación de la primera fila
                         map.setCenter(new google.maps.LatLng(lasttLatitude, lastLongitude));
                        
                        
                        if (previousMarkerPosition !== null) {
                            var lineHeading = google.maps.geometry.spherical.computeHeading(previousMarkerPosition, smoothedPath[0]);
                            var numInterpolatedPoints = 100; // Ajusta este valor según sea necesario

                            // Interpola puntos a lo largo del camino entre la posición anterior y la nueva
                            for (var j = 0; j < numInterpolatedPoints; j++) {
                                var fraction = j / numInterpolatedPoints;
                                var interpolatedPoint = google.maps.geometry.spherical.interpolate(previousMarkerPosition, smoothedPath[0], fraction);
                                smoothedPath.unshift(interpolatedPoint);
                            }
                        }
                        polyline.setPath(smoothedPath)
                        previousMarkerPosition = new google.maps.LatLng(lastLatitude, lastLongitude) ;
                       
                    } else {
                        console.error("Las coordenadas de la primera fila no son números válidos.");
                    }
                }
                // para hacerlo suave
               
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
