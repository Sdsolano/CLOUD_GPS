function reloadTable() {
    $.ajax({
        url: "/components",
        method: "GET",
        success: function(response) {
            
            var tablaHTML = "<table>";
            tablaHTML += "<thead><tr><th>ID</th><th>Latitude</th><th>Longitude</th><th>Time_stamp</th></tr></thead>";
            tablaHTML += "<tbody>";
            response.forEach(function(row) {
                tablaHTML += "<tr><td>" + row.ID + "</td><td>" + row.Latitude + "</td><td>" + row.Longitude + "</td><td>" + row.Time_stamp + "</td></tr>";
            });
            tablaHTML += "</tbody></table>";

            
            $("#tabla-contenido").html(tablaHTML);
        },
        error: function(xhr, status, error){
            console.error("AJAX request failed", error);
        }
    });
}



$(document).ready( function(){
        reloadTable()

        setInterval(reloadTable, 7000);
});


