let map, latValue, lngValue;

// Loading Google Maps function
function loadMap(latValue, lngValue, zoomNumber) {
    if(!latValue && lngValue) {
        latValue = -31.9523123;
        lngValue = 115.861309;
    }
    console.log("Latitude: " + latValue + ", Longitude: " + lngValue);
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: latValue, lng: lngValue },
        zoom: zoomNumber,
    });
    new google.maps.Marker({
        position: { lat: latValue, lng: lngValue },
        map,
    });   
}

// Auto complete function - using the google maps autocomplete API
function autoComplete() {
    var locationInput = document.querySelector('#appointment-location');
    var autocomplete = new google.maps.places.Autocomplete(locationInput);
    google.maps.event.addListener(autocomplete, 'place_changed', function () {
        var city = autocomplete.getPlace();
        latValue = city.geometry.location.lat();
        lngValue = city.geometry.location.lng();
        loadMap(latValue, lngValue, 14);
    });
}

google.maps.event.addDomListener(window, 'load', autoComplete);

loadMap(-31.9523123, 115.861309, 3);
