
    function actualizarTabla() {
        $.ajax({
            url: "/components",
            method: "GET",
            success: function(respuesta) {
                // Construir la tabla a partir de los datos JSON recibidos
                var tablaHTML = "<table><thead><tr><th>ID</th><th>Latitud</th><th>Longitud</th><th>Timestamp</th></tr></thead><tbody>";

                respuesta.forEach(function(fila) {
                    tablaHTML += "<tr><td>" + fila.ID + "</td><td>" + fila.Latitude + "</td><td>" + fila.Longitude + "</td><td>" + fila.Time_stamp + "</td></tr>";
                });

                tablaHTML += "</tbody></table>";

                // Actualizar el contenido del div "tabla-contenido"
                $("#tabla-contenido").html(tablaHTML);
            }
        });
    }

    // Actualizar cada 5 segundos (5000 milisegundos)
    setInterval(actualizarTabla, 5000);

   
    actualizarTabla();

