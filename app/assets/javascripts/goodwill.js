/********************************/
/******* Google variables *******/
/********************************/

var map, inviteCounter = 0, deedCounter = 0, deeds = [], deedIndex, featuredIndex = 1;

/************************************/
/******* Google map functions *******/
/************************************/

// Adds a pin on the map(passing in a title, icon and location)
var placeMarker = function(loc, data, mapIcon) {
  var marker = new google.maps.Marker({
    position: loc,
    map: map,
    title: data.name,
    icon: mapIcon
  });
  var msg = makeMessage(data);
  attachMessage(marker, msg);
};

// Formats the info to be displayed in the info window on the map
var makeMessage = function(data) {
  var template = JST['templates/map_info']({data: data});
  return template;
};

// Attaches the info window and event handler onto each marker
function attachMessage(marker, msg) {
  var infowindow = new google.maps.InfoWindow(
      { content: msg,
        size: new google.maps.Size(50,50)
      });
  google.maps.event.addListener(marker, 'click', function() {
    infowindow.open(map,marker);
  });
}

// Creating locations and placing markers
var setLocations = function(data) {
  var mapIcon;
  // array for locations for polylines
  var locations = [];
  // Setting the map icon based on whether deed is current or already completed
  _.each(data.posts, function(d) {
    if(d.complete === true) {
      mapIcon = 'marker_heart.png';
    } else {
      mapIcon = 'current_marker_heart2.png';
    }
    // Setting the location where deed was or is being done
    var location = new google.maps.LatLng(d.lat, d.lon)
    // Calling the placeMarker function to add a marker at the location
    placeMarker(location, d, mapIcon);
    // Adding locations to array for polylines
    locations.push(location);
  });
  // Returning locations to be used to draw the polylines connecting corresponding locations
  return(locations)
};

var drawLines = function(locations) {
  // Index for cycling through locations
  var i = 0
  // While there is still an i + 1 location(has to be 2 locations to connect), this function is run to connect the locations
  while(i < locations.length - 1) {
    // Grabbing the 2 corresponding locs to connect
    var locs = [locations[i], locations[i + 1]];
    // Setting the path for the polyline
    var paths = new google.maps.Polyline({
      path: locs,
      strokeColor: "#4681BD",
      geodesic: true,
      strokeOpacity: 1.0,
      strokeWeight: 1
    });
    // Adding the polyline to the map
    paths.setMap(map);
    i += 1
  }
};

var mapPoints = function(data) {
  // Placing locations and drawing lines connecting them
  drawLines(setLocations(data));
};

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
      // Creating a new map with current location as center
      map = new google.maps.Map($('#map-canvas')[0], mapOptions);
      // Initiating the get current function if a current user exists, to get current thread and its corresponding locations to place markers on map and connect them
      if(gon.logged_in === true) {
        fetchCurrent('map', mapPoints);
      }
    });
  }
}



/*******************************/
/******* Modal functions *******/
/*******************************/

var showModal = function() {
  $('.overlay').css('visibility', 'visible');
  // Getting the position for the modal to move too based on window position
  var top = $(window).scrollTop() - 50;
  $('.overlayWindow').css('max-height', ($(window).height() * 0.9))
  $('.overlayWindow').fadeIn(500).animate({'top': top}, {duration: 300, queue: false});
};

var hideModal = function() {
  $('.overlay').css('visibility', 'hidden');
  $('.overlayWindow').fadeOut(500).animate({'top': '-1000px'}, {duration: 300, queue: false});
  // Resetting the modal
  $('.window').empty();
  // Resetting the deed counter
  deedCounter = 0;
};

// Function to set the modal width and postion based on the container width
var modalSize = function(size) {
  // Getting the width and taking off the 'px'
  var width = $('.container').css('width');
  var pattern = /[0-9]+/;
  // Calculating the modal size based on the input percentage
  var new_width = parseInt(width.match(pattern)[0]) * size;
  // Getting the left positioning
  var windowWidth = $(window).width();
  var left = (parseInt(width.match(pattern)[0])/2) - (new_width/2);
  // Setting the modal width and left positioning
  $('.overlayWindow').css('width', new_width);
  $('.overlayWindow').css('left', left);
};


/*********************************/
/******* Utility functions *******/
/*********************************/

var capitalize = function(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}



/********************************/
/******* On load function *******/
/********************************/


// Start of Javascript when page loads
$(function() {
  assignEvents();

  // Add the map to the map canvas
  google.maps.event.addDomListener(window, 'load', mapInit);

  if(gon.logged_in === true) {
    fetchCurrent('thread', setCurrent);
  }

  // If user follows a redirect link this will trigger sign-in/sign-up process
  if(gon.logged_in != true && gon.queue === true) {
    // Auto-triggering the sign-in from the invite link redirect
    $('#signin').click();
  }

  checkCurrent();

  populatePosts();

  populatePage(modalLists);
  // // Hiding the modal on page load
  // $('#overlayWindow').fadeOut();





  // // Populating all the lists with deeds from the db
  // populatePage(pageLists); // In deeds.js

  // // Populating the featured list with most popular suggested deeds
  // populatePage(featuredLists); // In deeds.js

  // // Populating the featured local with most popular local cause
  // populatePage(featuredLocal); // In deeds.js

  // // Populating the recent posts list
  // populatePosts();



  // // Close modal
  // assignCloseModal();

  // // assignDeedClicks();





  // // Setting the voting event delegates
  // assignEvents();




});