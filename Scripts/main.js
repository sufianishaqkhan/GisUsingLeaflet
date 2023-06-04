var initMap = function (lat, long, zoom, tilesOption) {
    map = L.map('map', {
        center: [lat, long],
        zoom: zoom
    });

    L.tileLayer(tilesOption[0], tilesOption[1]).addTo(map);
};

var loadGeoJsonMappings = function (geoJsonMappingsArray) {
    geoJsonMappingsArray.forEach(geoJson => {
        L.geoJSON(geoJson, 
            { 
                color: "#FF0000",
                weight: 0.5
            }
        ).addTo(map);
    });
};

var loadMarkerClusters = function (markerClusterLatLongArray) {
    markers = L.markerClusterGroup();

    markerClusterLatLongArray.forEach(locationCoordinates => {
        markers.addLayer(L.marker(locationCoordinates));
    });
    
    map.addLayer(markers);
};

var addMarker = function (lat, long) {
    L.marker([lat, long]).addTo(map)
    .bindPopup('This is a location marker.')
    // .openPopup()
    ;
};

var addCircle = function (lat, long) {
    L.circle([lat, long], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 30000
    }).addTo(map)
    .bindPopup("This is a circle marker.")
    // .openPopup()
    ;
};

var addPolygon = function (boundaryLatLongsArray) {
    L.polygon(boundaryLatLongsArray).addTo(map)
    .bindPopup("This is a polygon marker.")
    // .openPopup()
    ;
};

var loadCenterPointsOfGeoJsonFeatures = function (geoJSONArray) {
    var districtCentersArray = [];
    var polygonsWithCenters = L.layerGroup();

    var geoJsonLayer = L.geoJSON(geoJSONArray, {
      onEachFeature: function (feature, layer) {
        var center = layer.getBounds().getCenter();
        var marker = L.marker(center);
        var polygonAndItsCenter = L.layerGroup([layer, marker]);
        polygonAndItsCenter.addTo(polygonsWithCenters);

        districtCentersArray.push({ DISTRICT_ID: feature.properties.DISTRICT_ID, DISTRICT_NAME: feature.properties.DISTRICT, Center_LatLong: center});
      },
    });
    
    polygonsWithCenters.addTo(map);
    // console.log(JSON.stringify(districtCentersArray));
};

//Default values
var map = null;
var zoom = 7;
var markers= null;

//Lat, long, Zoom (Karachi)
var latKarachi = 24.860970;
var longKarachi = 66.990501;
var boundaryLatLongsArrayKarachi = [
    [24.8395424,66.6523538],
    [24.9720483,66.7950134],
    [25.0357352,66.9581728],
    [25.2120028,67.0453461],
    [25.3270334,67.1640196],
    [25.5141489,67.2109846],
    [25.6406056,67.3667226],
    [25.3456373,67.4319621],
    [25.1427961,67.6445514],
    [24.7759278,67.4814026],
    [24.8145334,67.2531596],
    [24.7516286,67.0750963],
    [24.8601439,66.8558892],
    [24.8395424,66.6523538],
];

//Lat, long, Zoom (Sindh Center)
var latSindh = 26.1806083;
var longSindh = 68.7912237;

//Marker Cluster Lat Long List
var markerClusterLatLongArray = [
    [24.8395424,66.6523538],
    [24.9720483,66.7950134],
    [25.0357352,66.9581728],
    [25.2120028,67.0453461],
    [25.3270334,67.1640196],
    [25.5141489,67.2109846],
    [25.6406056,67.3667226],
    [25.3456373,67.4319621],
    [25.1427961,67.6445514],
    [24.7759278,67.4814026],
    [24.8145334,67.2531596],
    [24.7516286,67.0750963],
    [24.8601439,66.8558892],
    [24.8395424,66.6523538],
];

//Tiles options
//OpenStreetMap - local language names
var tilesOSM    = [ 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 20, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }];
//CARTO - english names
var tilesCARTO  = [ 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', { maxZoom: 20, attribution: '&copy; <a href="https://carto.com/basemaps/">CARTO 2022</a>' }];
//Google - streets, hybrid, satellite and terrain tiles
var tilesGoogleOptions  = { maxZoom: 20, subdomains: ['mt0','mt1','mt2','mt3'], attribution: '&copy; <a href="https://maps.google.com/">Google Maps 2022</a>' }
var tilesGoogleStreets  = [ 'http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', tilesGoogleOptions ];
var tilesGoogleHybrid   = [ 'http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', tilesGoogleOptions ];
var tilesGoogleSat      = [ 'http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', tilesGoogleOptions ];
var tilesGoogleTerrain  = [ 'http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', tilesGoogleOptions ];

var tilesOption = tilesGoogleStreets; //Selected tiles option

//Initialize Map
initMap(latSindh, longSindh, zoom, tilesOption);

//Mappings array to create/mark boundary layers on map (Pakistan and Sindh)
var geoJsonMappingsArray = [];

//Convert EsriJson to GeoJson and push to geoJsonMappingsArray
geoJsonMappingsArray.push(ArcgisToGeojsonUtils.arcgisToGeoJSON(JSON.parse(floodedAreasEsriJson)));
// geoJsonMappingsArray.push(ArcgisToGeojsonUtils.arcgisToGeoJSON(JSON.parse(schoolsInFloodedAreasEsriJson)));

// geoJsonMappingsArray.push(ArcgisToGeojsonUtils.arcgisToGeoJSON(JSON.parse(nationalEsriJson)));
// geoJsonMappingsArray.push(JSON.parse(provinceGeoJson));
// geoJsonMappingsArray.push(JSON.parse(divisionGeoJson));
geoJsonMappingsArray.push(JSON.parse(districtGeoJson));
// geoJsonMappingsArray.push(JSON.parse(tehsilGeoJson));
// geoJsonMappingsArray.push(JSON.parse(ucGeoJson));

loadGeoJsonMappings(geoJsonMappingsArray);

//Initialize and apply leaflet marker clusters
// loadMarkerClusters(markerClusterLatLongArray);

//Adding markers to map
// addMarker(latKarachi, longKarachi);
// addCircle(latKarachi, longKarachi);
// addPolygon(boundaryLatLongsArrayKarachi);

// addMarker(27.867540196622883, 69.66444984423495); //Ghotki


//Load districts center points
// loadCenterPointsOfGeoJsonFeatures(JSON.parse(districtGeoJson));