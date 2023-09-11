// Define variables globales para el mapa y el marcador
let map = null;
let marker = null;

// Coordenadas geográficas fijas para el marcador
const fixedLatLng = [0, 0]; // Reemplaza estas coordenadas con las que desees

// Bandera para verificar si el mapa ya se ha inicializado
let mapInitialized = false;

// Función para inicializar el mapa con Leaflet
function initMap() {
    if (!mapInitialized) {
        // Inicializa el mapa con Leaflet
        map = L.map('map').setView([0, 0], 13);

        // Agrega un mapa base de OpenStreetMap (puedes cambiarlo a otro proveedor de mapas)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
        }).addTo(map);

        // Deshabilita el zoom con la rueda del ratón
        map.scrollWheelZoom.disable();

        // Crea un marcador en la posición geográfica fija, pero NO lo agregues al mapa aún
        marker = L.marker(fixedLatLng);

        mapInitialized = true; // Establece la bandera en verdadero para evitar futuras inicializaciones
    }
}

// Resto del código (reloadTable y document.ready) permanece igual

