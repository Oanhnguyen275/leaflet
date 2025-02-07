
let map = L.map("map", {
    center: [
      40.7, -94.5
    ],
    zoom: 3
  });
  
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson").then(function(data) {

  // Function to determine the color based on depth
  function getColor(depth) {
    return depth > 500 ? '#800026' :
           depth > 300 ? '#BD0026' :
           depth > 200 ? '#E31A1C' :
           depth > 100 ? '#FC4E2A' :
           depth > 50  ? '#FD8D3C' :
           depth > 20  ? '#FEB24C' :
           depth > 10  ? '#FED976' :
                         '#FFEDA0';
  }

  // Function to determine the radius size
  function getRadius(magnitude) {
    return magnitude * 2;
  }

  // Loop through each earthquake data
  data.features.forEach(function(earthquake) {
    var lat = earthquake.geometry.coordinates[1];
    var lon = earthquake.geometry.coordinates[0];
    var depth = earthquake.geometry.coordinates[2];
    var magnitude = earthquake.properties.mag;
    var place = earthquake.properties.place;
    var time = new Date(earthquake.properties.time).toLocaleString();

    // Create a circle marker for each earthquake
    L.circleMarker([lat, lon], {
      radius: getRadius(magnitude),
      fillColor: getColor(depth),   
      color: "black",              
      weight: 1,                  
      opacity: 1,                   
      fillOpacity: 0.7             
    })
    .bindPopup(`<strong>Location:</strong> ${place}<br>
                <strong>Magnitude:</strong> ${magnitude}<br>
                <strong>Depth:</strong> ${depth} km<br>
                <strong>Time:</strong> ${time}`)
    .addTo(map);
  });

  // Create a legend for depth colors
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function() {
    var div = L.DomUtil.create('div', 'legend');
    var grades = [0, 10, 20, 50, 100, 200, 300, 500];
    var labels = [];

    // Loop through the depth range and add color indicators
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
        '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + ' km<br>' : '+ km');
    }

    return div;
  };

  legend.addTo(map);
});
