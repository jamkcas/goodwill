// Creating an intial map
var mapInit = function() {
  var mapOptions = {
    center: new google.maps.LatLng(-34.397, 150.644),
    zoom: 8
  };
  var map = new google.maps.Map($('#map-canvas')[0],
      mapOptions);
}


// Start of Javascript when page loads
$(function() {
  // Hiding the modal on page load
  $('#overlayWindow').fadeOut();
  // Populating all the lists with deeds from the db
  populatePage(); // In deeds.js
  // Setting the current project if one exists
  getCurrent(); // In posts.js
  // Add the map to the map canvas
  google.maps.event.addDomListener(window, 'load', mapInit);
});