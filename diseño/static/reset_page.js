var map;
var marker;

function initMap() {
    // Recupera el mapa existente del contenedor con ID 'map' en tu HTML
    map = L.map('map').setView([0, 0], 10); // Centro del mapa inicial y nivel de zoom

    // Agrega un mapa base de OpenStreetMap (puedes cambiarlo a otro proveedor de mapas)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 15, // Nivel de zoom máximo
        minZoom: 5, // Nivel de zoom mínimo
    }).addTo(map);

    // Crea el marcador en el mapa
    marker = L.marker([0, 0]).addTo(map);

    actualizarDatos(); // Llama a la función para cargar los datos y el mapa inicialmente

    // Actualiza la tabla y el marcador cada 5 segundos (5000 milisegundos)
    setInterval(actualizarDatos, 5000);
}

function actualizarDatos() {
    $.ajax({
        url: "/components", // Reemplaza con la URL correcta para obtener datos
        method: "GET",
        success: function (respuesta) {
            if (respuesta.length > 0) {
                var primeraCoordenada = respuesta[0];

                // Actualiza la posición del marcador con las coordenadas de la primera coordenada
                marker.setLatLng([parseFloat(primeraCoordenada.Latitude), parseFloat(primeraCoordenada.Longitude)]);
            } else {
                console.error("No se encontraron datos para mostrar en el mapa.");
            }
        },
        error: function (xhr, status, error) {
            console.error("AJAX request failed", error);
        }
    });
}

// Llama a la función initMap al cargar la página
$(document).ready(function () {
    initMap();
});
