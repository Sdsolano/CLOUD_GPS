let map;
let map2;
let marker;
let marker2;
let markers2;
let markerHis;
let firstMarker;
let currentIndex;
let polyline; 
let polyline2;
let infoArray;


let timeStampsArray;

let inDate;
let finDate;

let markerCoordinates = []; // Almacena las coordenadas del marcador
let isDrawingPolyline = false; 

function initMap() {
    // Inicializa el mapa
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -0.5, lng: 0.5 }, // Coordenadas iniciales de ejemplo
        zoom: 13,
        minZoom: 5,
    });
    // Crea el marcador en el mapa
    marker = new google.maps.Marker({
        position: { lat: -0.5, lng: 0.5 }, // Coordenadas iniciales de ejemplo
        map: map,
        title: "Mi Marcador"
    });
    // Inicializa una polilínea vacía en el mapa
    polyline = new google.maps.Polyline({
        path: [], // Inicialmente vacío
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2,
        map: map,
    });
    // Configura el evento clic en el botón "polylineDraw" para iniciar o detener la polilínea
   
     $("#adjustView").click(function() {
        var markerCurrentPosition = marker.getPosition();
        map.setCenter(markerCurrentPosition);
        map.setZoom(18);
    });
    $("#polylineErase").click(function() {
        erasePolyline();
    });
    // Carga la tabla y actualiza el mapa
    reloadTable();
}
function initMap2() {
    // Configura las opciones del mapa
    var mapOptions = {
        zoom: 10, // Establece el nivel de zoom inicial
    };
    // Crea un nuevo mapa en el div "mapa-historicos"
     map2 = new google.maps.Map(document.getElementById('mapa-historicos'), mapOptions);
    // Realiza una solicitud AJAX para obtener la última posición desde la base de datos
    $.ajax({
        url: "/components", // Cambia la URL a la que debes hacer la solicitud AJAX
        method: "GET",
        success: function (response) {
            if (Array.isArray(response) && response.length > 0) {
                // Obtiene la última posición de la respuesta
                var lastPosition = response[0];
                // Obtiene las coordenadas de la última posición
                var latLng = new google.maps.LatLng(parseFloat(lastPosition.Latitude), parseFloat(lastPosition.Longitude));
                 // Crea un marcador en la última posición
            
                // Centra el mapa en la última posición
                
                map2.setCenter(latLng);
            }
        },
        error: function (xhr, status, error) {
            console.error("AJAX request failed", error);
        }
    });
}
// Función para mostrar la sección correspondiente según el fragmento de URL o por defecto
function mostrarSeccionDesdeFragmento() {
    var fragment = window.location.hash;
    if (fragment === '#home' || fragment === '') {
        // Mostrar la sección Home
        document.getElementById('home').style.display = 'block';
        document.getElementById('historicos').style.display = 'none'; // Ocultar Históricos
    } else if (fragment === '#historicos') {
        // Mostrar la sección Históricos
        document.getElementById('home').style.display = 'none'; // Ocultar Home
        document.getElementById('historicos').style.display = 'block';
        initMap2();
    }
}
// Ejecutar la función al cargar la página
window.onload = mostrarSeccionDesdeFragmento;
// Manejar cambios en la URL (por ejemplo, cuando se hace clic en los enlaces de la barra de navegación)
window.onhashchange = mostrarSeccionDesdeFragmento;
function drawPolyline() {
    // Añade las coordenadas actuales del marcador a la polilínea
    polyline.setPath(markerCoordinates);
    const smoothedPath = google.maps.geometry.spherical.computeSpline(markerCoordinates, 10);
    // Actualiza la polilínea con las coordenadas suavizadas
    polyline.setPath(markerCoordinates);
}
function erasePolyline() {
    // Detiene la creación de la polilínea
    markerCoordinates = [];
    
    // Restaura el botón de dibujar la polilínea a su estado original
    $("#polylineDraw").text("Draw Polyline");
    
    // Borra las polilíneas existentes
    polyline.setPath(markerCoordinates);
    
    
    
}
function reloadTable() {
    $.ajax({
        url: "/components",
        method: "GET",
        success: function (response) {
            if (typeof google !== 'undefined' && typeof google.maps !== 'undefined') {
                // Verifica si la API de Google Maps se ha cargado
                // Actualiza la tabla con los últimos tres datos
                var tablaHTML = "<table>";
                tablaHTML += "<thead><tr><th>ID</th><th>Latitude</th><th>Longitude</th><th>Time_stamp</th></tr></thead>";
                tablaHTML += "<tbody>";
                for (var i = 0; i < Math.min(response.length, 3); i++) {
                    var row = response[i];
                    tablaHTML += "<tr><td>" + row.ID + "</td><td>" + row.Latitude + "</td><td>" + row.Longitude +  "</td><td>" + row.Time_stamp + "</td></tr>";
                    var latitude = parseFloat(row.Latitude);
                    var longitude = parseFloat(row.Longitude);
                }
                tablaHTML += "</tbody></table>";
                $("#tabla-contenido").html(tablaHTML);
                if (response.length > 0) {
                    var firstRow = response[0];
                    var firstLatitude = parseFloat(firstRow.Latitude);
                    var firstLongitude = parseFloat(firstRow.Longitude);
                    
                    // Añade coordenadas a la polilínea si se está dibujando
                    if ( !isNaN(parseFloat(firstRow.Latitude)) && !isNaN(parseFloat(firstRow.Longitude))) {
                        markerCoordinates.push(new google.maps.LatLng(parseFloat(firstRow.Latitude),parseFloat(firstRow.Longitude)));
                    }
                
                    if (!isNaN(firstLatitude) && !isNaN(firstLongitude)) {
                        // Comprueba si las coordenadas han cambiado
                        var markerPosition = marker.getPosition();
                        var newMarkerPosition = new google.maps.LatLng(firstLatitude, firstLongitude);
                        
                        if (!markerPosition.equals(newMarkerPosition)) {
                            // Actualiza la posición del marcador con las coordenadas de la primera fila
                            marker.setPosition(newMarkerPosition);   
                        }
                        map.setCenter(newMarkerPosition);
                    } else {
                        console.error("Las coordenadas de la primera fila no son números válidos.");
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

function actualizarHistoricosData(data, indexCenter) {
    var historicosDataDiv = $("#historicos-data");
    historicosDataDiv.empty(); // Limpia el contenido anterior
    

    // Elimina la polilínea existente si hay una
    if (polyline2) {
        polyline2.setMap(null);
    }
      if (firstMarker) {
        firstMarker.setMap(null);
    }

    // Creamos un arreglo para almacenar las coordenadas de la polilínea
    var polylineCoordinates = [];
    var infoWindowContent = "";

    if (Array.isArray(data) && data.length > 0) {
        // Itera sobre los datos y agrega coordenadas a la polilínea
        data.forEach(function (coordenada, index) {
            var latitude = parseFloat(coordenada.Latitude);
            var longitude = parseFloat(coordenada.Longitude);

            // Verifica si las coordenadas son números válidos
            if (!isNaN(latitude) && !isNaN(longitude)) {
                var latLng = new google.maps.LatLng(latitude, longitude);
                polylineCoordinates.push(latLng);

                // Agrega un marcador en la primera posición
                if (index === indexCenter) {
                     firstMarker = new google.maps.Marker({
                        position: latLng,
                        map: map2,
                        title: "Primera Coordenada",
                    });
                }
                
            }
        });

        // Siempre crea una nueva polilínea, incluso si hay una existente, ya que eliminamos la existente arriba
        polyline2 = new google.maps.Polyline({
            path: polylineCoordinates,
            geodesic: true,
            strokeColor: '#00FF00', // Color de la línea (verde en este ejemplo)
            strokeOpacity: 1.0,
            strokeWeight: 2,
            map: map2, // Asigna el mapa en el que deseas dibujar la polilínea
        });

        // Opcionalmente, puedes centrar el mapa en el primer punto de la polilínea
        if (firstMarker) {
            map2.setCenter(firstMarker.getPosition());
       
        infoWindowContent = '<div class="container" style="margin-top: 10px;">' +
        '<ul style="list-style-type:none; padding: 0; display: flex; flex-direction: row;">' +
        '<li style="margin-right: 20px;"> <b> Location number: </b> ' + (indexCenter + 1) + '</li>' +
        '<li style="margin-right: 20px;"> <b> Coordinates: </b> ' + firstMarker.getPosition().lat() + ', ' + firstMarker.getPosition().lng() + '</li>' +
        '<li> <b> Location date: </b>' + timeStampsArray[indexCenter] + '</li>' +
        '</ul>' +
        '</div>';
        }

    } else {
        if (inDate.isAfter(finDate)) {
           console.log("Todo bien");
        } else {
            alert("no data could be found in this time period");
        }
        
    }
    $("#info-window-content").html(infoWindowContent);
}













$(document).ready(function () {
    
    // Carga la tabla y actualiza el mapa cuando se carga la página
    reloadTable();
    // Configura el intervalo para actualizar la tabla y el mapa cada 7 segundos
    setInterval(reloadTable, 1000);
    setInterval( drawPolyline, 1000);
    $('#campo1, #campo2').daterangepicker({
        singleDatePicker: true, // Habilita la selección de una sola fecha
        timePicker: true, // Habilita la selección de hora
        timePicker24Hour: true, // Utiliza el formato de 24 horas
        timePickerSeconds: false, // Deshabilita la selección de segundos
        locale: {
            format: 'YYYY-MM-DD HH:mm:00', // Define el formato deseado
        },
    });

    $('#campo1, #campo2').prop('readonly', true);

    $('#campo1, #campo2').on('apply.daterangepicker', function (ev, picker) {
        var startDateStr = $("#campo1").val();
        var endDateStr = $("#campo2").val();
    
        // Parsea las cadenas de texto en objetos de fecha y hora
        var startDate = moment(startDateStr, 'YYYY-MM-DD HH:mm:00');
        var endDate = moment(endDateStr, 'YYYY-MM-DD HH:mm:00');
    
        // Compara las fechas
        if (startDate.isAfter(endDate)) {
            alert("The Start date cannot be greater than the End date");
            // Restaura la fecha de inicio a la fecha anterior válida
            $("#campo1").val($("#campo1").data('previous-value'));
        } else {
            // Actualiza el valor anterior válido
            $("#campo1").data('previous-value', startDateStr);
        }
    });

        

  
      $("#historicos-form").submit(function (event) {

        var startDateStr = $("#campo1").val();
        var endDateStr = $("#campo2").val();
    
        // Parsea las cadenas de texto en objetos de fecha y hora
        var startDate = moment(startDateStr, 'YYYY-MM-DD HH:mm:00');
        var endDate = moment(endDateStr, 'YYYY-MM-DD HH:mm:00');
    
        // Compara las fechas
        if (startDate.isAfter(endDate)) {
            alert("The Start date cannot be greater than the End date");
            // Restaura la fecha de inicio a la fecha anterior válida
            $("#campo1").val($("#campo1").data('previous-value'));
        } else {
            // Actualiza el valor anterior válido
            $("#campo1").data('previous-value', startDateStr);
        }


        event.preventDefault(); // Evita que el formulario se envíe de forma estándar
        console.log("Formulario enviado");
    
        // Obtener los valores de los campos de fecha de inicio y fecha de fin
        var fechaInicio = $("#campo1").val();
        var fechaFin = $("#campo2").val();

        inDate = moment(fechaInicio,'YYYY-MM-DD HH:mm:00') ;
        finDate = moment(fechaFin,'YYYY-MM-DD HH:mm:00') ;
    
        // Enviar los valores al servidor Flask utilizando AJAX
        $.ajax({
            type: 'POST',
            url: '/historicos',
            data: { fecha_inicio: fechaInicio, fecha_fin: fechaFin },
            success: function (response) {
                currentIndex = 0;
                infoArray = response.coordenadas; // Obtenemos las coordenadas
                timeStampsArray = response.time_stamps; // Obtenemos los Time_stamp
                
                // Manejar la respuesta del servidor aquí
                console.log(infoArray); // Imprime las coordenadas en la consola del navegador
                console.log(timeStampsArray); // Imprime los Time_stamp en la consola
                
                map2.setZoom(18);
                actualizarHistoricosData(infoArray, currentIndex);
                
                $("#slider").slider({
                    min: 0,
                    max: infoArray.length - 1,
                    value: currentIndex,
                    create: function (event, ui) {
                        $("#slider-text").show(); 
                    },
                    slide: function (event, ui) {
                        currentIndex = ui.value;
                        actualizarHistoricosData(infoArray, currentIndex);
                    }
                });
            },
            error: function (error) {
                console.error(error);
            }
        });
        

    });
        
});