//store queryurl
var queryURL="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

//get request to URL
d3.json(queryURL, function(data){
    createFeatures(data.features);
})

function Color(magnitude) {
    if (magnitude >= 5) {
        return 'red'
    } else if (magnitude >= 4) {
        return 'darkorange'
    } else if (magnitude >= 3) {
        return 'orange'
    } else if (magnitude >= 2) {
        return 'yellow'
    } else if (magnitude >= 1) {
        return 'darkgreen'
    } else {
        return 'lightgreen'
    }
};
function createFeatures(earthquakeData) {
    
    //create popup feature
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place 
        + "</h3><hr><p>" + new Date(feature.properties.time) + "</p>"
        + "</h3><hr><p>Magnitude: " + feature.properties.mag + "</p>");
    }

    //create geoJSONlayer
    var earthquakes= L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: function (point, latlng) {
            return L.circleMarker(latlng, { radius: 4*point.properties.mag });
        },
        style: function (geoJsonFeature) {
            return {
                fillColor: Color(geoJsonFeature.properties.mag),
                fillOpacity: 0.7,
                weight: 0.1,
                color: 'black'
            }
        }
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
    //add legend
    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (map) {
  
        var div = L.DomUtil.create('div', 'info legend'),
            magnitude = [0, 1, 2, 3, 4, 5],
            //colors = Color.options.colors,
            labels = [];
  
        var legendInfo = "<h4 style='margin:4px'>Magnitude</h4>" +
        "<div class=\"labels\">"  +
        "<div class=\"min\">" + magnitude[0] + "</div>" +
        "<div class=\"max\">" + magnitude[magnitude.length - 1] + "</div>" +
        "</div>";

        div.innerHTML = legendInfo;
        
        magnitude.forEach(function(mag){
            labels.push("<li style=\"background-color: " + Color(mag) + "\"></li>");
        });

        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
       
        console.log(labels)
        return div;
    }
    legend.addTo(myMap);
};
