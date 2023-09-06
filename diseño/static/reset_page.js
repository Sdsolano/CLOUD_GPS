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

    $.ajax({
        url: "/components",
        method: "GET",
        success: function (response) {
            if (typeof google !== 'undefined' && typeof google.maps !== 'undefined') {
                // Verifica si la API de Google Maps se ha cargado

                if (!map) {
                    // Si el mapa aún no se ha inicializado, llama a initMap
                    initMap();
                }

                // Actualiza el mapa y el marcador aquí
                if (response.length > 0) {
                    var lastRow = response[response.length - 1];
                    var lastLatitude = parseFloat(lastRow.Latitude);
                    var lastLongitude = parseFloat(lastRow.Longitude);
                        var lastTime= parseFloat(lastRow.Time_stamp);
var tablaHTML = "<table>";
            tablaHTML += "<thead><tr><th>ID</th><th>Latitude</th><th>Longitude</th><th>Time_stamp</th></tr></thead>";
            tablaHTML += "<tbody>";
            response.forEach(function(row) {
                tablaHTML += "<tr><td>" + row.ID + "</td><td>" + row.Latitude + "</td><td>" + row.Longitude +  "</td><td>" + row.Time_stamp + "</td></tr>";          });
            tablaHTML += "</tbody></table>";


            $("#tabla-contenido").html(tablaHTML);


                    if (!isNaN(lastLatitude) && !isNaN(lastLongitude)) {
                        // Actualiza la posición del marcador
                        marker.setPosition(new google.maps.LatLng(lastLatitude, lastLongitude));
let contenidoMarcador ="Latitude:"+ lastLatitude + "<br> Longitude:" + lastLongitude + "<br> Timestamp"+ lastTime ;
let infoWindow = new google.maps.InfoWindow({
        content: contenidoMarcador
    });

    // Abre el InfoWindow cuando se hace clic en el marcador
    marker.addListener('click', function() {
        infoWindow.open(map, marker);
    });
                        // Centra el mapa en la nueva ubicación
                        map.setCenter(new google.maps.LatLng(lastLatitude, lastLongitude));

                        console.log("Last Latitude:", lastLatitude);
                        console.log("Last Longitude:", lastLongitude);
                    } else {
                        console.error("Las coordenadas no son números válidos.");
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
    // Llama a reloadTable al cargar la página
    reloadTable();

    // Establece un intervalo para actualizar el mapa y el marcador cada 67 segundos
    setInterval(reloadTable, 7000);
