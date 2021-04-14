// Auto complete function - using the google maps autocomplete API
function autoComplete() {
    var locationInput = document.querySelector('#appointment-location');
    new google.maps.places.Autocomplete(locationInput);
}

google.maps.event.addDomListener(window, 'load', autoComplete);