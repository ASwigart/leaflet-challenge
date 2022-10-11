console.log("working")
// ASKBCS solution potential from index.html 
var theMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });



var theMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});
// bathymetric layer from https://github.com/GeoTIFF/georaster-layer-for-leaflet-example/blob/master/examples/bathymetry.html#L39
var url_to_geotiff_file = "https://georaster-layer-for-leaflet.s3.amazonaws.com/Blue-Earth-Bathymetry-COG.tif";
 
parseGeoraster(url_to_geotiff_file).then(georaster => {
    console.log("georaster:", georaster);
    var scale = chroma.scale(['black', 'cyan']).domain([-11022, 0]);
    var tbathLayer = new GeoRasterLayer({
        attribution: "GEBCO & Tom Patterson",
        georaster: georaster,
        opacity: 0.75,
        resolution: 64,
        pixelValuesToColorFn: function (values) {
          const elevation = values[0];
          if (elevation > 0) return "rgb(34, 15, 50)";
          return scale(elevation).hex();
        }
    })
    tbathLayer.addTo(bathLayer)
    bathLayer.addTo(map)
});

// base layer
var map = L.map("map", {
    center: [38.50, -96.00],
    zoom: 3,
    layers:[topo,theMap]
});
theMap.addTo(map)
// console.log()
var baseMaps ={
    "Basic Map": theMap,
    Topography: topo
};

var tectonicplates = new L.LayerGroup();
var earthquakes = new L.LayerGroup();
var bathLayer = new L.LayerGroup();
var overlays = {
    "Tectonic Plates": tectonicplates,
    Earthquakes: earthquakes,
    bathLayer: bathLayer 
};

L.control
        .layers(baseMaps, overlays)
        .addTo(map);
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function (data) {
    function styleInfo(feature) {
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: getColor(feature.geometry.coordinates[2]),
            color: "#000000",
            radius: getRadius(feature.properties.map),
            stroke: true,
            weight: 0.5
        };
    }

console.log(earthquakes);

    function getColor(depth) {
        switch (true){
            case depth > 90:
                return "#ea2c2c";
            case depth > 70:
                return "#ea822c";
            case depth > 50:
                return "#ee9c00";
            case depth > 30:
                return "#eecc00";
            case depth > 10:
                return "#d4ee00";
            default:
                return "#98ee00";
        }
    }
    function getRadius(magnitude) {
        if (magnitude === 0) {
            return 1;
        }
        return magnitude * 4;
        }
// GeoJSON layer
    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },
    style: styleInfo,
// pop-ups
    onEachFeature: function (feature, layer) {
        layer.bindPopup(
            "Magnitude: "
            +feature.properties.mag
            +"<br>Depth: "
            +feature.geometry.coordinates[2]
            +"<br>Location: "
            +feature.properties.place
        );
    }
}).addTo(earthquakes);
earthquakes.addTo(map);
// legend control
    var legend =L.control({
        position: "bottomright"
    });
    legend.onAdd= function(){
        var div = L.DomUtil.create("div", "info Legend");
        var magnitudes = [-10, 10, 30, 50, 70, 90];
        var colors = [
            "#98ee00",
            "#d4ee00",
            "#eecc00",
            "#ee9c00",
            "#ea822c",
            "#ea2c2c"];
        for (var i = 0; i < magnitudes.length; i++) {
            div.innerHTML += "<i style='background: "
                +colors[i]
                +" '></i>"
                +magnitudes[i]
                +(magnitudes[i+1] ? "&ndash;" +magnitudes[i+1]+ "<br>" : "+");
        }
        return div;
    };
    legend.addTo(map);
// call ajax
    d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(function (platedata) {
        L.geoJson(platedata, {
            color: "orange",
            weight: 2
        }).addTo(tectonicplates);
        tectonicplates.addTo(map);
    });
});







