
// Creating an intial map
var mapInit = function() {
  var mapOptions = {
    center: new google.maps.LatLng(-34.397, 150.644),
    zoom: 8
  };
  var map = new google.maps.Map($('#map-canvas')[0],
      mapOptions);

  if(navigator.geolocation) {
    browserSupportFlag = true;
    navigator.geolocation.getCurrentPosition(function(position) {
      initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
      map.setCenter(initialLocation);
    }, function() {
      handleNoGeolocation(browserSupportFlag);
    });
  }
}

var showModal = function() {
  $('#overlay').css('visibility', 'visible');
  $('#overlayWindow').fadeIn(500).animate({'top': '50px'}, {duration: 300, queue: false});
};

var hideModal = function() {
  $('#overlay').css('visibility', 'hidden');
  $('#overlayWindow').fadeOut(500).animate({'top': '-1000px'}, {duration: 300, queue: false});
  // Resetting the modal
  $('#overlayWindow').empty();
};

var capitalize = function(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

// Start of Javascript when page loads
$(function() {
  // Hiding the modal on page load
  $('#overlayWindow').fadeOut();

  // Populating all the lists with deeds from the db
  populatePage(pageLists); // In deeds.js

  // Setting the current project if one exists and User is logged in
  if(gon.logged_in === true) {
    getCurrent(); // In posts.js
  }

  // Puts an event on the signin button so it can be auto-triggered
  $('#signin').click(function() {
    window.location.href = $('#signin').attr('href');
  });

  // If user follows a redirect link this will trigger sign-in/sign-up process
  if(gon.logged_in != true && gon.queue === true) {

    // Auto-triggering the sign-in from the invite link redirect
    $('#signin').click();
  }
  // Add the map to the map canvas
  google.maps.event.addDomListener(window, 'load', mapInit);
});