var map; 
var marker; 

function initializeMap(latitude, longitude) {
    // Crea el mapa y el marcador en la primera llamada
    map = L.map('map').setView([latitude, longitude], 16);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    marker = L.marker([latitude, longitude]).addTo(map);
}



function reloadTable() {
    $.ajax({
        url: "/components",
        method: "GET",
        success: function(response) {
            if (response.length > 0) {
                var lastLocation = response[0];
                // initialize map
                if (!map) {
                    // last location
                    initializeMap(lastLocation.Latitude, lastLocation.Longitude);
                } else {
                 
                    marker.setLatLng([lastLocation.Latitude, lastLocation.Longitude]);
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

