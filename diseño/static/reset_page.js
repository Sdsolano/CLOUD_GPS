
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

                    // Mostrar los últimos tres datos
                    var lastIndex = Math.max(0, response.length - 3);
                    for (var i = lastIndex; i < response.length; i++) {
                        var row = response[i];
                        tablaHTML += "<tr><td>" + row.ID + "</td><td>" + row.Latitude + "</td><td>" + row.Longitude + "</td><td>" + row.Time_stamp + "</td></tr>";
                    }

                    tablaHTML += "</tbody></table>";
                    $("#tabla-contenido").html(tablaHTML);

                    if (response.length > 0) {
                        var lastRow = response[response.length - 1];
                        var lastLatitude = parseFloat(lastRow.Latitude);
                        var lastLongitude = parseFloat(lastRow.Longitude);

                        if (!isNaN(lastLatitude) && !isNaN(lastLongitude)) {
                            marker.setPosition(new google.maps.LatLng(lastLatitude, lastLongitude));
                            map.setCenter(new google.maps.LatLng(lastLatitude, lastLongitude));
                        } else {
                            console.error("Las coordenadas del último registro no son números válidos.");
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

    // Llama a initMap y updateTableAndMap cuando se carga la página
    $(document).ready(function () {
        initMap(); 
        updateTableAndMap(); 
    });

    // Actualiza ambos al mismo tiempo con un intervalo de 7 segundos
    setInterval(function() {
        updateTableAndMap();
    }, 7000);

