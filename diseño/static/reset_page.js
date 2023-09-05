var map; // Declara una variable global para el mapa
var marker; // Declara una variable global para el marcador

function initializeMap(latitude, longitude) {
    // Crea el mapa y centra en las coordenadas
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: latitude, lng: longitude },
        zoom: 16 // Puedes ajustar el nivel de zoom según tus necesidades
    });

    // Agrega un marcador en las coordenadas
    marker = new google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map: map,
        draggable: true, // Permite que el marcador se pueda arrastrar
        title: 'Last Location!'
    });
}

function reloadTable() {
    $.ajax({
        url: "/components",
        method: "GET",
        success: function(response) {
            // Actualiza la tabla como lo hacías antes
            var tablaHTML = "<table>";
            tablaHTML += "<thead><tr><th>ID</th><th>Latitude</th><th>Longitude</th><th>Time_stamp</th></tr></thead>";
            tablaHTML += "<tbody>";
            response.forEach(function(row) {
                tablaHTML += "<tr><td>" + row.ID + "</td><td>" + row.Latitude + "</td><td>" + row.Longitude + "</td><td>" + row.Time_stamp + "</td></tr>";
            });
            tablaHTML += "</tbody></table>";
            $("#tabla-contenido").html(tablaHTML);

            if (response.length > 0) {
                var lastLocation = response[0];
                // Si el mapa no se ha inicializado, inicialízalo
                if (!map) {
                    initializeMap(lastLocation.Latitude, lastLocation.Longitude);
                } else {
                    // Actualiza la posición del marcador
                    var newLatLng = new google.maps.LatLng(lastLocation.Latitude, lastLocation.Longitude);
                    marker.setPosition(newLatLng);
                    map.setCenter(newLatLng);
                }
            }
        },
        error: function(xhr, status, error) {
            console.error("AJAX request failed", error);
        }
    });
}

$(document).ready(function() {
    reloadTable();

    setInterval(reloadTable, 7000);
});
