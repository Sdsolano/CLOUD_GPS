// Define variables globales para el mapa y el marcador
let map;

// Coordenadas geográficas fijas para el marcador
const fixedLatLng = [0, 0]; // Reemplaza estas coordenadas con las que desees

// Función para inicializar el mapa con Leaflet
function initMap() {
    // Inicializa el mapa con Leaflet
    map = L.map('map').setView([0, 0], 13);

    // Agrega un mapa base de OpenStreetMap (puedes cambiarlo a otro proveedor de mapas)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(map);

    // Crea un marcador en la posición geográfica fija
    const marker = L.marker(fixedLatLng).addTo(map);
}

// Función para cargar y actualizar la tabla
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
            } else {
                console.error("No se encontraron datos para mostrar en la tabla.");
            }
        },
        error: function (xhr, status, error) {
            console.error("AJAX request failed", error);
        }
    });
}

$(document).ready(function () {
    initMap(); // Llama a la función initMap para inicializar el mapa
    reloadTable();
    setInterval(reloadTable, 7000);
});
