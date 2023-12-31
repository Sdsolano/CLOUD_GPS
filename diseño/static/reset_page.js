let map;
let map2;
let map3;    //mapa de busqueda 2
let marker;
let marker2;
let markers2;
let markerHis;


let radius;      //radio busq. 2

let firstMarker;
let currentIndex;
let polyline; 
let polyline2;
let infoArray; //vector de coordenadas
let Area_search_coordinates;
let Time_ASC;
let timeStampsArray;  //vector de fechas
let counter;
let inDate;
let finDate;

let markerCoordinates = []; // Almacena las coordenadas del marcador
let isDrawingPolyline = false; 
var circle = null;
var markersWithinCircle = [];
var currentMarker = null;
var position;
var circle2 = null;
var markerDates = null;


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
    var sliderContainer = document.querySelector('.slider-container'); // Get the slider container

    // Hide the slider initially
    sliderContainer.style.display = 'none';
    $("#Mslider-text").hide(); 
    $("#markerSlider").hide();
    $("#count").hide(); 
    $("#Location-date").hide(); 
    $("#scrollToBottom").hide(); 
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

function initMap3() {
    var mapOptions = {
        zoom: 15,
    };
    $("#titulo-fechas").html("When did my vehicle pass through here?")
    $("#parrafo-fechas").html("Click on the map over the place you want to know when your vehicle passed through. The dates are limited between the dates of the previous search.");
    
    $("#buscar").show(); 
    $("#scrollToBottom").show(); 
    map3 = new google.maps.Map(document.getElementById('mapa-fechas'), mapOptions);

    // Realiza una solicitud AJAX para obtener la última posición desde la base de datos
    $.ajax({
        url: "/components", // Cambia la URL a la que debes hacer la solicitud AJAX
        method: "GET",
        success: function (response) {
            if (Array.isArray(response) && response.length > 0) {

                var lastPosition = response[0];
                // Obtiene las coordenadas de la última posición
                var latLng = new google.maps.LatLng(parseFloat(lastPosition.Latitude), parseFloat(lastPosition.Longitude));
                // Crea un marcador en la última posición

                map3.setCenter(latLng);
            }
        },
        error: function (xhr, status, error) {
            console.error("AJAX request failed", error);
        }
    });

    

    

   
    // Add a slider control for selecting the circle radius
    var radiusSlider = document.getElementById('radiusSlider');
    var radiusValue = document.getElementById('radiusValue');
    var sliderContainer = document.querySelector('.slider-container'); // Get the slider container

    // Hide the slider and "Update Circle" button initially
    sliderContainer.style.display = 'none';

    radiusSlider.addEventListener('input', function () {
        var radius = parseInt(radiusSlider.value);
        radiusValue.textContent = radius + " meters";
    });
    
    google.maps.event.addListener(map3, 'click', function (event) {
  
         if (currentMarker) {
            currentMarker.setMap(null);
        }
        if (markerDates) {
            markerDates.setMap(null);
        }

        if (circle) {
            circle.setMap(null); // Remove the existing circle if any
        }

        markerDates = new google.maps.Marker({
            position: event.latLng,
            map: map3,
            title: "Right-Click Marker",
        });
        $("#parrafo2-fechas").html("Select a radius between 100 and 1000 meters");
        
        // Create the circle with the specified radius from the slider
        var radius = parseInt(radiusSlider.value);
        circle = new google.maps.Circle({
            strokeColor: '#1C2F4F',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#2A508C',
            fillOpacity: 0.35,
            map: map3,
            center: event.latLng,
            radius: radius,
        });

        // Show the slider and "Update Circle" button
        sliderContainer.style.display = 'block';
        document.getElementById('updateCircle').style.display = 'none';
    });
    

  
}

function circlechanger (radio){
        position = markerDates.getPosition();
        if (circle) {
            circle.setMap(null); // Remove the existing circle if any
        }
        

        circle = new google.maps.Circle({
            strokeColor: '#1C2F4F',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#2A508C',
            fillOpacity: 0.35,
            map: map3,
            center: position,
            radius: radio,
        });
}



// Función para mostrar la sección correspondiente según el fragmento de URL o por defecto
function mostrarSeccionDesdeFragmento() {
    var fragment = window.location.hash;
    var homeLink = document.querySelector('a[href="#home"]');
    var historicosLink = document.querySelector('a[href="#historicos"]');
    var aboutLink = document.querySelector('a[href="#about"]');

    if (fragment === '#home' || fragment === '') {
        // Mostrar la sección Home
        document.getElementById('home').style.display = 'block';
        document.getElementById('historicos').style.display = 'none'; // Ocultar Históricos
        document.getElementById('about').style.display = 'none'; // Ocultar About
        // Deshabilitar el enlace de Home
        homeLink.classList.add('disabled');
        historicosLink.classList.remove('disabled');
        aboutLink.classList.remove('disabled');
    } else if (fragment === '#historicos') {
        // Mostrar la sección Históricos
        document.getElementById('home').style.display = 'none'; // Ocultar Home
        document.getElementById('historicos').style.display = 'block';
        document.getElementById('about').style.display = 'none'; // Ocultar About
        initMap2();
        // Deshabilitar el enlace de Históricos
        historicosLink.classList.add('disabled');
        homeLink.classList.remove('disabled');
        aboutLink.classList.remove('disabled');
    } else if (fragment === '#about') {
        // Mostrar la sección About
        document.getElementById('home').style.display = 'none'; // Ocultar Home
        document.getElementById('historicos').style.display = 'none'; // Ocultar Históricos
        document.getElementById('about').style.display = 'block';
        // Deshabilitar el enlace de About
        aboutLink.classList.add('disabled');
        homeLink.classList.remove('disabled');
        historicosLink.classList.remove('disabled');
    } else {
        // Si el fragmento es desconocido, puedes manejarlo aquí
        // Por ejemplo, puedes ocultar todas las secciones
        document.getElementById('home').style.display = 'none';
        document.getElementById('historicos').style.display = 'none';
        document.getElementById('about').style.display = 'none';
        // Y deshabilitar todos los enlaces
        homeLink.classList.remove('disabled');
        historicosLink.classList.remove('disabled');
        aboutLink.classList.remove('disabled');
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
    $("#Mslider-text").hide(); 
    $("#markerSlider").hide();
    $("#count").hide(); 
    $("#Location-date").hide(); 

    

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
    var iconSettings = {
        path: 'M25.395,0H17.636c-3.117,0-5.643,3.467-5.643,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759' +
            'c3.116,0,5.644-2.527,5.644-5.644V6.584C35.037,3.467,32.511,0,29.395,0z M34.05,14.188v11.665l-2.729,0.351v-4.806L34.05,14.188z' +
            'M32.618,10.773c-1.016,3.9-2.219,8.51-2.219,8.51H16.631l-2.222-8.51C14.41,10.773,23.293,7.755,32.618,10.773z M15.741,21.713' +
            'v4.492l-2.73-0.349V14.502L15.741,21.713z M13.011,37.938V27.579l2.73,0.343v8.196L13.011,37.938z M14.568,40.882l2.218-3.336' +
            'h13.771l2.219,3.336H14.568z M31.321,35.805v-7.872l2.729-0.355v10.048L31.321,35.805z',
        fillColor: '#FFC02B',
        fillOpacity: 1,
        scale: 0.6,
        strokeColor: 'black',
        strokeWeight: 1.5,
        anchor: new google.maps.Point(23, 0),
        rotation: 90
    };
    

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
                        icon: iconSettings, // Set the custom icon
                    });
                }
                
            }
        });
        

        // Siempre crea una nueva polilínea, incluso si hay una existente, ya que eliminamos la existente arriba
        polyline2 = new google.maps.Polyline({
            path: polylineCoordinates,
            geodesic: true,
            strokeColor: '#FF0000', // Color de la línea (verde en este ejemplo)
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
    $('#campo1').daterangepicker({
        singleDatePicker: true, // Habilita la selección de una sola fecha
        timePicker: true, // Habilita la selección de hora
        timePicker24Hour: true, // Utiliza el formato de 24 horas
        timePickerSeconds: false, // Deshabilita la selección de segundos
        
        locale: {
            format: 'YYYY-MM-DD HH:mm:00', // Define el formato deseado
        },
    });
    var fechaCampo1 = $('#campo1').data('daterangepicker').startDate;

    // Calcula el día siguiente y configura el startDate de campo2
    var startDateCampo2 = fechaCampo1.clone().add(1, 'days');

   
    $('#campo2').daterangepicker({
        singleDatePicker: true, // Habilita la selección de una sola fecha
        timePicker: true, // Habilita la selección de hora
        timePicker24Hour: true, // Utiliza el formato de 24 horas
        timePickerSeconds: false,
        startDate: startDateCampo2, // Deshabilita la selección de segundos
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

                if (infoArray.length > 0 ){
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
                }
            },
            error: function (error) {
                console.error(error);
            }
        });
        
        initMap3();
        document.getElementById('radiusSlider').addEventListener('input', function () {
            var newRadius = parseInt(radiusSlider.value);
            circlechanger(newRadius);
        });
    });

    $("#scrollToBottom").on("click", function () {
            // Calculate the distance to scroll
            const scrollDistance = document.body.scrollHeight - window.innerHeight;
    
            // Scroll to the bottom of the page smoothly
            window.scrollTo({
                top: scrollDistance,
                behavior: 'smooth'
            });
        });



    $("#buscar").on("click", function () {
        $("#scrollToBottom").show(); 
        

        if (!circle) {
            alert("Please set the circle on the map first.");
            return;
        }
    
        // Define a function to check if a coordinate is within the circle
        function isCoordinateInCircle(coordinate) {
            var circleBounds = circle.getBounds();
            var coordinateLatLng = new google.maps.LatLng(coordinate.Latitude, coordinate.Longitude);
            return circleBounds.contains(coordinateLatLng);
        }

        // Clear the existing data in the arrays
        Area_search_coordinates = [];
        Time_ASC = [];
        counter = 0;
        // Iterate through infoArray and check if each coordinate is within the circle
        for (var i = 0, j = 0; i < infoArray.length; i++) {
            if (isCoordinateInCircle(infoArray[i])) {
                Area_search_coordinates[j]=infoArray[i];
                Time_ASC[j] = timeStampsArray[i];
                j +=1;
                counter = counter + 1
            }
        }
    
        // Now you can do something with the markersWithinCircle array
        if (Area_search_coordinates.length > 0) {
            console.log("Coordinates within the circle:", Area_search_coordinates);
        } else {
            alert("No position records found within the area.");
            console.log("No coordinates found within the circle.");
        }
        // Initialize the slider with the correct range
        var slider = document.getElementById('markerSlider');
        slider.min = 0; // Minimum value (0)
        slider.max = Area_search_coordinates.length - 1; // Maximum value (length of the array minus one)
        slider.value = 0; // Initial value (0)
        $("#Mslider-text").show(); 
        $("#markerSlider").show(); 
        $("#count").show(); 
        $("#Location-date").show(); 
        // document.getElementById('markerSlider').style.display = 'block';
        // document.getElementById('Mslider-text').style.display = 'block';
        // Initialize the slider with the default value (e.g., 0 for the first marker)
        document.getElementById('markerSlider').value = 0;
        updateMarker(0); // Initialize the marker with the first coordinate

                // Add an event listener to the slider input
        document.getElementById('markerSlider').addEventListener('input', function () {
            var sliderValue = parseInt(this.value);
            updateMarker(sliderValue);
        });
        

    });

    
    
    function updateMarker(index) {
        var iconSettings = {
            path: 'M25.395,0H17.636c-3.117,0-5.643,3.467-5.643,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759' +
                'c3.116,0,5.644-2.527,5.644-5.644V6.584C35.037,3.467,32.511,0,29.395,0z M34.05,14.188v11.665l-2.729,0.351v-4.806L34.05,14.188z' +
                'M32.618,10.773c-1.016,3.9-2.219,8.51-2.219,8.51H16.631l-2.222-8.51C14.41,10.773,23.293,7.755,32.618,10.773z M15.741,21.713' +
                'v4.492l-2.73-0.349V14.502L15.741,21.713z M13.011,37.938V27.579l2.73,0.343v8.196L13.011,37.938z M14.568,40.882l2.218-3.336' +
                'h13.771l2.219,3.336H14.568z M31.321,35.805v-7.872l2.729-0.355v10.048L31.321,35.805z',
            fillColor: '#FFC02B',
            fillOpacity: 1,
            scale: 0.6,
            strokeColor: 'black',
            strokeWeight: 1.5,
            anchor: new google.maps.Point(23, 0),
            rotation: 90
        };
        // Remove the existing marker if present
        if (currentMarker) {
            currentMarker.setMap(null);
        }
    
        if (index >= 0 && index < Area_search_coordinates.length) {
            var coordinate = Area_search_coordinates[index];
            var timestamp = Time_ASC[index];
    
            var coordinateLatLng = new google.maps.LatLng(coordinate.Latitude, coordinate.Longitude);
            currentMarker = new google.maps.Marker({
                position: coordinateLatLng,
                map: map3,
                title: "Coordinate " + index,
                icon: iconSettings,
                // You can add more information to the marker, e.g., timestamp
                //label: timestamp,
            });
    
            // Center the map on the current marker
            //map3.setCenter(coordinateLatLng);

            $("#Location-date").html("<b> Location date: </b>"+Time_ASC[index])
            $("#count").html("<b> We have found </b> <b>"+ counter + "</b><b> location records in the provided area. </b>")
        }

    }

               
            var images = document.querySelectorAll(".zoomable-image");

            images.forEach(function(image) {
            image.addEventListener("click", function() {
                var modal = document.createElement("div");
                modal.classList.add("image-modal");

                var modalImage = new Image();
                modalImage.src = this.src;
                modalImage.classList.add("modal-content");

                modal.appendChild(modalImage);

                modal.addEventListener("click", function() {
                modal.remove();
                });

                document.body.appendChild(modal);
            });
});





    
    
        
});


