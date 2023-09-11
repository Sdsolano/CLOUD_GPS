// Define variables globales para el mapa y el marcador
let map;
let marker;

// Coordenadas geográficas fijas para el marcador
const fixedLatLng = [0, 0]; // Reemplaza estas coordenadas con las que desees

// Función para inicializar el mapa con Leaflet
function initMap() {
    // Inicializa el mapa con Leaflet
    map = L.map('map').setView([0, 0], 13);

    // Deshabilita el zoom con la rueda del ratón
    map.scrollWheelZoom.disable();

    // Agrega un mapa base de OpenStreetMap (puedes cambiarlo a otro proveedor de mapas)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(map);

    // Crea un marcador en la posición geográfica fija, pero NO lo agregues al mapa aún
    marker = L.marker(fixedLatLng);
}

// Resto del código (reloadTable y document.ready) permanece igual

