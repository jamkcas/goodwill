/********************************/
/******* Recent post functons *******/
/********************************/

// Function to populate the recent posts
var populatePosts = function() {
  $.get('/posts/recent').done(function(data) {
    _.each(data, function(post) {
      var template = JST['templates/recent_post']({ data: post });
      $('#recentList').append(template);
    });
  });
};













/*****************************************/
/******* Confirmation modal events *******/
/*****************************************/






/***********************************/
/******* Current post events *******/
/***********************************/




// Event for when a user wants to see the details of a particular deed
var assignShowDetails = function() {
  $('#overlayWindow').on('click', '.deedEntry', function(e) {
    e.preventDefault();
    var current = $(this);
    var id = current.parent().data('id');
    // Making a call to the db and getting the deed details
    $.get('/deeds/' + id).done(function(data) {
      // Hiding the lists of deeds div
      $('.lists').hide();
      $('.modalHeader').hide();
      // Creating and appending the deed details to the entry details div
      var template = JST['templates/deed_details']({ details: data });
      $('.entryDetails').append(template);
    });
  });
};

// Event in the show details flow for when the user hits the back button
var assignBack = function() {
  $('#overlayWindow').on('click', '.back', function(e) {
    e.preventDefault();
    // Reshows the lists div and clears out the entry details div
    $('.lists').show();
    $('.modalHeader').hide();
    $('.entryDetails').empty();
  });
};

// Event for when user finishes the start thread flow and saves an initial post
var assignSavePost = function() {
  $('#overlayWindow').on('click', '.submitPost', function(e) {
    e.preventDefault();
    var id = $(this).data('id');
    navigator.geolocation.getCurrentPosition(function(position) {
      initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
      $.ajax('/posts/create', {
        method: 'POST',
        data: {
                data_id: id,
                lat: initialLocation.nb,
                lon: initialLocation.ob
              }
      }).done(function(data) {
        // The modal is hidden
        hideModal();
        // If a false status is returned then an error message is returned
        if(data === false) {
          // Removes any previous error messages
          $('.error').remove();
          // Adds a new error message
          $('#thread').prepend("<p class='error'>Post was unable to be saved. Please try again.</p>")
        } else {
          // Sets the queue to false if a post was created
          gon.queue = false;
          // The thread div is emptied (start thread button removed)
          $('#thread').empty();
          // The fetch current function is called to set the contents of the thread div to the current posts details
          fetchCurrent(setCurrent);
        }
      });
    });
  });
};

// // Make a call to the posts/current to find the user's current post and thread
// var getCurrent = function() {
//   fetchCurrent(setCurrent);

//   // When the user wants to post that they have finished the deed and hit Post as Complete
//   assignPostComplete();

//   // Finish a Post
//   assignFinish();

//   // When an invite is clicked, an ajax call is made to email an invite to the corresponding contact
//   assignInvite();

//   // When clicked, a modal pops up with a start a new thread form
//   assignStart();

//   // When clicked, the deeds lists are hidden and the deed details of deed clicked are made visible
//   assignShowDetails();

//   // When clicked the deeds list is shown again and the entry details div is emptied
//   assignBack();

//   // When clicked the an ajax call is made to save the new post to the db
//   assignSavePost();

//   // Assigning the behaviors for the confirmation modal
//   assignCloseConfirmModal();
//   assignConfirmDecline();
//   assignConfirmAccept();

//
// };


