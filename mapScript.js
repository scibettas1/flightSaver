var fromLat = 0.00;
var fromLng = 0.00;
var toLat = 0.00;
var toLng = 0.00;
var map;

(function () {
    var placesAutocomplete = places({
        appId: 'plKZWQZ4OYQ8',
        apiKey: '6b884ab3c793e4319219fc9e58d16f67',
        container: document.querySelector('#comingFrom')

    }).configure({
        type: 'city',
        aroundLatLngViaIP: false,
    });
    placesAutocomplete.on("change", function resultSelected(e) {
        fromLat = parseFloat(e.suggestion.latlng.lat);
        fromLng = parseFloat(e.suggestion.latlng.lng);
        console.log(fromLat + ',' + fromLng);
    });
})();


(function () {
    var placesAutocomplete = places({
        appId: 'plKZWQZ4OYQ8',
        apiKey: '6b884ab3c793e4319219fc9e58d16f67',
        container: document.querySelector('#goingTo')

    }).configure({
        type: 'city',
        aroundLatLngViaIP: false,
    });
    placesAutocomplete.on("change", function resultSelected(e) {
        toLat = parseFloat(e.suggestion.latlng.lat);
        toLng = parseFloat(e.suggestion.latlng.lng);
        console.log(toLat + ',' + toLng);
    });
})();


function displayMap() {
    if (map) {
        map.off();
        map.remove();
    }
    var placesAutocomplete = places({
        appId: 'plKZWQZ4OYQ8',
        apiKey: '6b884ab3c793e4319219fc9e58d16f67',
        container: document.querySelector('#input-map')
    });

    //var latlng = L.latLng(39.952583, -75.165222);
        map = L.map('map-example-container', {
        center: L.latLng(0, 0),
        zoom: 4
    });

    var osmLayer = new L.TileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        minZoom: 3,
        maxZoom: 17,
        attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
    }
    );

    var markers = [];
    var fromMarker = L.marker([fromLat, fromLng], { title: 'Your Starting Destination' }).addTo(map).bindPopup('Departing from')
        .openPopup();

    var toMarker = L.marker([toLat, toLng]).addTo(map).bindPopup('Your Destination')
        .openPopup();

    markers.push(fromMarker);
    markers.push(toMarker);
    console.log(markers);

    var latlngs = [
        [fromLat, fromLng],
        [toLat, toLng]
    ];

    var polyline = L.polyline(latlngs, { color: 'red' }).addTo(map);

    // zoom the map to the polyline
    map.fitBounds(polyline.getBounds());

    //map.setView(new L.LatLng(50.5, 30.5), 1);
    map.addLayer(osmLayer);

    placesAutocomplete.on('suggestions', handleOnSuggestions);
    placesAutocomplete.on('cursorchanged', handleOnCursorchanged);
    placesAutocomplete.on('change', handleOnChange);
    placesAutocomplete.on('clear', handleOnClear);

    // markers.on('click', function(e) {
    //     var zoomLat = $(this).latlng.lat;
    //     var zoomLng = $(this).latlng.lng;
    //     var zoomZ = [zoomLat, zoomLng]

    //     map.fitBounds(zoomZ.getBounds());
    // })

    function handleOnSuggestions(e) {
        markers.forEach(removeMarker);
        markers = [];

        if (e.suggestions.length === 0) {
            map.setView(new L.LatLng(0, 0), 1);
            return;
        }

        e.suggestions.forEach(addMarker);
        findBestZoom();
    }

    function handleOnChange(e) {
        markers
            .forEach(function (marker, markerIndex) {
                if (markerIndex === e.suggestionIndex) {
                    markers = [marker];
                    marker.setOpacity(1);
                    findBestZoom();
                } else {
                    removeMarker(marker);
                }
            });
    }

    function handleOnClear() {
        map.setView(new L.LatLng(0, 0), 1);
        markers.forEach(removeMarker);
    }

    function handleOnCursorchanged(e) {
        markers
            .forEach(function (marker, markerIndex) {
                if (markerIndex === e.suggestionIndex) {
                    marker.setOpacity(1);
                    marker.setZIndexOffset(1000);
                } else {
                    marker.setZIndexOffset(0);
                    marker.setOpacity(0.5);
                }
            });
    }

    function addMarker(suggestion) {
        var marker = L.marker(suggestion.latlng, { opacity: .4 });
        marker.addTo(map);
        markers.push(marker);
    }

    function removeMarker(marker) {
        map.removeLayer(marker);
    }

    function findBestZoom() {
        var featureGroup = L.featureGroup(markers);
        map.fitBounds(featureGroup.getBounds().pad(0.5), { animate: false });
    }
}


