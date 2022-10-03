// Store the API

var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson";

// perform the request
d3.json(queryUrl). then (function (data){
    createFeatures (data.features);
});

function createFeatures (earthquakeData) {
 
// Define a function that we want to run once for each feature in the features array.
// Give each feature a popup that describes the place and time of the earthquake.
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
        }

    var earthquakeLayer = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature
    });

    // createMap (earthquakes);
}
function createMap(earthquakes) {

    // Create the base layers.
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
  
    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    var baseMap = {
        "Street Map" : street,
        "Topo Map" : topo,
        "Base Map" : baseMap,
        "earthquakeLayer Map" : earthquakeData
    };
  
// create map
    var Map = L.map('map', {
        center: [
            39.828, -98.579
        ], 
        zoom: 13,
        layers: [earthquakeLayer, topo]
    });

    L.control.layers (Map, overlayMaps, {
        collapsed: false
    }). addTo(Map);

}
    