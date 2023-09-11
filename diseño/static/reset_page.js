<script>
    var map;
    var markers = [];

    function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: 0, lng: 0 }, // Centro del mapa inicial
            zoom: 10 // Nivel de zoom inicial
        });
        actualizarDatos(); // Llama a la función para cargar los datos y el mapa inicialmente
    }

    function actualizarDatos() {
        $.ajax({
            url: "/components",
            method: "GET",
            success: function (respuesta) {
                // Limpiar marcadores existentes
                markers.forEach(function (marker) {
                    marker.setMap(null);
                });
                markers = [];

                // Construir la tabla y marcar el mapa
                var tablaHTML = "<table><thead><tr><th>ID</th><th>Latitud</th><th>Longitud</th><th>Timestamp</th></tr></thead><tbody>";

                respuesta.forEach(function (fila, index) {
                    tablaHTML += "<tr><td>" + fila.ID + "</td><td>" + fila.Latitude + "</td><td>" + fila.Longitude + "</td><td>" + fila.Time_stamp + "</td></tr>";

                    // Marcar el mapa con las coordenadas
                    var marker = new google.maps.Marker({
                        position: { lat: parseFloat(fila.Latitude), lng: parseFloat(fila.Longitude) },
                        map: map,
                        title: "Ubicación " + fila.ID
                    });
                    markers.push(marker);

                    // Centrar el mapa en la primera coordenada
                    if (index === 0) {
                        map.setCenter(marker.getPosition());
                    }
                });

                tablaHTML += "</tbody></table>";

                // Actualizar el contenido del div "tabla-contenido"
                $("#tabla-contenido").html(tablaHTML);

                // Llamar a la función nuevamente después de 5 segundos (5000 milisegundos)
                setTimeout(actualizarDatos, 5000);
            }
        });
    }

    // Llama a la función initMap al cargar la página
    google.maps.event.addDomListener(window, 'load', initMap);
</script>
