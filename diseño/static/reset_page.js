    let map;
    let marker;

    function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: -0.5, lng: 0.5 }, // Coordenadas iniciales de ejemplo
            zoom: 13,
            minZoom: 12,
        });

        marker = new google.maps.Marker({
            map: map,
            title: "Mi Marcador"
        });
    }

    function updateTableAndMap() {
        $.ajax({
            url: "/components",
            method: "GET",
            success: function (response) {
                if (typeof google !== 'undefined' && typeof google.maps !== 'undefined') {
                    var tablaHTML = "<table>";
                    tablaHTML += "<thead><tr><th>ID</th><th>Latitude</th><th>Longitude</th><th>Time_stamp</th></tr></thead>";
                    tablaHTML += "<tbody>";

                    response.forEach(function (row) {
                        tablaHTML += "<tr><td>" + row.ID + "</td><td>" + row.Latitude + "</td><td>" + row.Longitude + "</td><td>" + row.Time_stamp + "</td></tr>";
                    });

                    tablaHTML += "</tbody></table>";
                    $("#tabla-contenido").html(tablaHTML);

                    if (response.length > 0) {
                        var firstRow = response[0];
                        var firstLatitude = parseFloat(firstRow.Latitude);
                        var firstLongitude = parseFloat(firstRow.Longitude);

                        if (!isNaN(firstLatitude) && !isNaN(firstLongitude)) {
                            marker.setPosition(new google.maps.LatLng(firstLatitude, firstLongitude));
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
    initMap(); 
    updateTableAndMap(); 

  
    setTimeout(function() {
        updateTableAndMap();
    }, 1000);

 
    setInterval(updateTableAndMap, 7000);
});


