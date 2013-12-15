var map
// Creating an intial map
var mapInit = function() {
  if(navigator.geolocation) {
    browserSupportFlag = true;
    navigator.geolocation.getCurrentPosition(function(position) {
      initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
      var mapOptions = {
        center: initialLocation,
        zoom: 8
      };
      map = new google.maps.Map($('#map-canvas')[0], mapOptions);
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
  // Add the map to the map canvas
  google.maps.event.addDomListener(window, 'load', mapInit);

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
});