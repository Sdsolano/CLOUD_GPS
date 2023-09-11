// Define variables globales para el mapa y el marcador
let map;
let marker;

// Función para inicializar el mapa con Leaflet
function initMap() {
    if (!map) { // Verifica si el mapa aún no se ha inicializado
        // Inicializa el mapa con Leaflet
        map = L.map('map').setView([0, 0], 13);

        // Agrega un mapa base de OpenStreetMap (puedes cambiarlo a otro proveedor de mapas)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
        }).addTo(map);
    }

    if (!marker) { // Verifica si el marcador aún no se ha creado
        // Crea un marcador en el mapa en una posición inicial
        marker = L.marker([0, 0]).addTo(map);
    }
}

// Función para cargar y actualizar la tabla y la posición del marcador
function reloadTable() {
    $.ajax({
        url: "/components",
        method: "GET",
        success: function (response) {
            // Verifica si la respuesta contiene datos
            if (response.length > 0) {
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

                // Obtén las coordenadas de la primera fila de la tabla
                var firstRow = response[0];
                var latLng = [parseFloat(firstRow.Latitude), parseFloat(firstRow.Longitude)];

                // Actualiza la posición del marcador con las coordenadas de la primera fila
                marker.setLatLng(latLng).update();

                // Centra el mapa en la ubicación de la primera fila
                map.setView(latLng);
            } else {
                console.error("No se encontraron datos para mostrar en el mapa.");
            }
        },
        error: function (xhr, status, error) {
            console.error("AJAX request failed", error);
        }
    });
}

$(document).ready(function () {
    initMap(); // Llama a la función initMap para inicializar el mapa (solo se ejecutará la primera vez)
    reloadTable();
    setInterval(reloadTable, 7000);
});
