let map;
let marker;

function initMap() {
    // Inicializa el mapa dentro de esta función
    map = L.map('map').setView([0, 0], 13);

    // Carga un mapa base de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
    }).addTo(map);

    // Crea un marcador en el mapa
    marker = L.marker([0, 0]).addTo(map).bindPopup('Mi Marcador');
}

function updateMapAndTable(response) {
    if (!map) {
        // Si el mapa aún no se ha inicializado, llama a initMap
        initMap();
    }

    // Actualiza el mapa y el marcador aquí
    if (response.length > 0) {
        var lastRow = response[response.length - 1];
        var lastLatitude = parseFloat(lastRow.Latitude);
        var lastLongitude = parseFloat(lastRow.Longitude);

        if (!isNaN(lastLatitude) && !isNaN(lastLongitude)) {
            // Actualiza la posición del marcador
            marker.setLatLng([lastLatitude, lastLongitude]);

            // Centra el mapa en la nueva ubicación
            map.panTo([lastLatitude, lastLongitude]);

            console.log("Last Latitude:", lastLatitude);
            console.log("Last Longitude:", lastLongitude);
        } else {
            console.error("Las coordenadas no son números válidos.");
        }
    }
}

function reloadTable() {
    $.ajax({
        url: "/components",
        method: "GET",
        success: function (response) {
            // Actualiza el mapa y la tabla
            updateMapAndTable(response);

            // Actualiza la tabla
            var tablaHTML = "<table>";
            tablaHTML += "<thead><tr><th>ID</th><th>Latitude</th><th>Longitude</th><th>Time_stamp</th></tr></thead>";
            tablaHTML += "<tbody>";

            response.forEach(function(row) {
                tablaHTML += "<tr><td>" + row.ID + "</td><td>" + row.Latitude + "</td><td>" + row.Longitude +  "</td><td>" + row.Time_stamp + "</td></tr>";
            });

            tablaHTML += "</tbody></table>";
            $("#tabla-contenido").html(tablaHTML);
        },
        error: function (xhr, status, error) {
            console.error("AJAX request failed", error);
        }
    });
}

$(document).ready(function () {
    // Llama a initMap para inicializar el mapa al cargar la página
    initMap();

    // Llama a reloadTable al cargar la página
    reloadTable();

    // Establece un intervalo para actualizar el mapa y el marcador cada 67 segundos
    setInterval(reloadTable, 7000);
});
