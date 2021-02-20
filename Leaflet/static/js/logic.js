//store queryurl
var queryURL="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

//get request to URL
d3.json(queryURL, function(data){
    createFeatures(data.features);
})

function createFeatures(earthquakeData) {
    
    //create popup feature
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place 
        + "</h3><hr><p>" + new Date(feature.properties.time) + "</p>"
        + "</h3><hr><p>Magnitude: " + feature.properties.mag + "</p>");
    }

    //create geoJSONlayer
    var earthquakes= L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature
    })

    createMap(earthquakes);
}

function createMap(earthquakes){
    //Define street map layer
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
    });
      //Create Base map
      var baseMaps = {
        "Street Map": streetmap
    };
      // Create overlay object to hold our overlay layer
        var overlayMaps = {
        Earthquakes: earthquakes
    };
    //create our map
    var myMap = L.map("mapid", {
        center: [
          37.09, -95.71
        ],
        zoom: 5,
        layers: [streetmap, earthquakes]
      });
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
      }).addTo(myMap);
    
}
