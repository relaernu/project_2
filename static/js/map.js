function map() {
    
    var current_id = "#map";
    var boundaries_url = "/boundaries";
    var location_url = "/location";

    var rowHeight = $("#firstRow").outerHeight();
    var headerHeight = $(current_id).parent().children(':first-child').outerHeight();

    var mapHeight = rowHeight-headerHeight;

    d3.select(current_id)
        .style("height", mapHeight+"px")
        .style("padding", "40px");


    function boundaries() {

    }

    function basicMap() {
        var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
            attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
            tileSize: 512,
            maxZoom: 18,
            zoomOffset: -1,
            id: "mapbox/streets-v11",
            accessToken: API_KEY
        });

        var baseMaps = {
            "Street Map": streetmap
        }

        var myMap = L.map("map", {
            center: [
                -37.020100, 144.964600
            ],
            zoom: 7,
            layers: [streetmap]
        });

        return myMap;
    }

    accMap = basicMap();

    // boundaries too many lines, not doing

    // d3.json(boundaries_url).then(function(data) {
    //     // Creating a GeoJSON layer with the retrieved data
    //     L.geoJson(data).addTo(accMap);
    // });
}

map();
