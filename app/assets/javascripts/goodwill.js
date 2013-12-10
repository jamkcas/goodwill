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

  // When the user wants to post that they have finished the deed and hit Post as Complete
  $('#thread').on('click', '#postComplete', function(e) {
    e.preventDefault();
    // Creating a popup modal to display form for submitting a completed deed
    template = JST['templates/post_complete']
    $('#overlay').css('visibility', 'visible');
    $('#overlayWindow').fadeIn(500).animate({'top': '50px'}, {duration: 300, queue: false});
  });

  // Close modal
  $('#closeModal').click(function(e) {
    e.preventDefault();
    // Hiding the popup modal
    $('#overlay').css('visibility', 'hidden');
    $('#overlayWindow').fadeOut(500).animate({'top': '-1000px'}, {duration: 300, queue: false});
  })
});