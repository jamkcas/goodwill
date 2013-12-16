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

  // Populating the featured list with most popular suggested deeds
  populatePage(featuredLists); // In deeds.js

  // Populating the featured local with most popular local cause
  populatePage(featuredLocal); // In deeds.js

  // Populating the recent posts list
  populatePosts();

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

  // Setting the voting event delegates
  $('.container').on('click', '.upVote', function(e) {
    e.preventDefault();
    var vote_id = $(this).parent().data('id');
    // Setting the vote instance varaible for use in the ajax callback
    var current_vote = $(this);
    $.ajax('/votes/save_vote', {
      method: 'POST',
      data: {
              vote_type: true,
              id: vote_id,
              votable_type: 'Deed'
            }
    }).done(function(data) {
      // Changing the vote on the index page if clicking on the modal page
      if(current_vote.parent().parent().parent().parent().hasClass('lists')) {
        emptyPage();
        populatePage(pageLists);
      }
      // Getting the old vote count
      oldTotal = current_vote.next().next().text();
      // Adding the new vote to the vote count
      new_total = parseInt(oldTotal) + parseInt(data)
      // Setting the new vote count to display
      current_vote.next().next().text(new_total);
      // Removing both voting buttons so the current user cant vote again
      current_vote.next().next().next().remove();
      current_vote.remove();
    });
  });

  $('.container').on('click', '.downVote', function(e) {
    e.preventDefault();
    var vote_id = $(this).parent().data('id');
    // Setting the vote instance varaible for use in the ajax callback
    var current_vote = $(this);
    $.ajax('/votes/save_vote', {
      method: 'POST',
      data: {
              vote_type: false,
              id: vote_id,
              votable_type: 'Deed'
            }
    }).done(function(data) {
      // Changing the vote on the index page if clicking on the modal page
      if(current_vote.parent().parent().parent().parent().hasClass('lists')) {
        emptyPage();
        populatePage(pageLists);
      }
      // Getting the old vote count
      oldTotal = current_vote.next().next().text();
      // Adding the new vote to the vote count
      new_total = parseInt(oldTotal) + parseInt(data)
      // Setting the new vote count to display
      current_vote.next().next().text(new_total);
      // Removing both voting buttons so the current user cant vote again
      current_vote.prev().prev().prev().remove();
      current_vote.remove();
    });
  });
});