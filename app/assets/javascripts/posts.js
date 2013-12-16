/********************************/
/******* Contact Functons *******/
/********************************/

// Function to add a contact contacts to the contacts list window
var addContacts = function(data) {
  var template = JST['templates/contacts_entry']({contacts: data});
  $('.contactsList').append(template);
};

// Function to fetch contacts after a google token request
var getContacts = function() {
  $.ajax('/contacts/get_contacts').done(function(data) {
    // If the google response hasnt come back, it will recall itself every 0.2s until it comes back (still need to edge case for if the user doesnt have any google contacts)
    if(data.length === 0) {
      setTimeout(getContacts, 200);
    } else {
      // Appending the contacts to the contacts list
      addContacts(data);
    }
  });
};

// Call to google to get permissions and ask for contacts list
var importGoogle = function() {
  // Ajax call to get authorization code and then access token for user
  $.ajax('/contacts/google').done(function(data) {
    // If a url is returned then a call is made to get an access token, otherwise the current user already has an access token
    if(data.url != 'null') {
      // Makes a popup window for Permissions page for google (auto-closes when done)
      window.open(data.url, "popupWindow", "width=600,height=600,scrollbars=yes");
    }
  });
  // Makes a call to get the contacts and append them to contacts list page
  getContacts();
  // Removing the add contacts function
  $('.importGoogle').remove();
};

// Call to get contacts if they exist on page load or add a button to get from google
var fetchContacts = function() {
  $.ajax('/contacts/get_contacts').done(function(data) {
    // If no contacts exist in the db then add a prompt and a button to import them
    if(data.length === 0) {
      var template = JST['templates/import'];
      $('.contacts').append(template);
      // Importing google contacts
      $('#overlayWindow').on('click', '.googleContacts', function(e) {
        e.preventDefault();
        importGoogle();
      });
    } else {
      // Appending the contacts to the contacts list
      addContacts(data);
    }
  });
}


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


/**************************************/
/******* Current post functions *******/
/**************************************/

// Function to set the modal with details to complete the post
var makePostModal = function(currentDeed) {
  var template = JST['templates/post_complete']({current: currentDeed});
  $('#overlayWindow').append(template);
};

// Function to grab post details, update the Post db, and make a post on facebook
var finishPost = function(current) {
  // Getting the values of te form fields in case the user changed these values
  var details = $('#deedDetails').val();
  var title = $('#postTitle').val();
  // Getting the id of the current post
  var id = $('#currentDeed').data('id');
  // Getting the user's current location then making an update to the db to complete the post
  navigator.geolocation.getCurrentPosition(function(position) {
    initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
    // Ajax call to update the current post as done in the db
    $.ajax('/posts/finish_post/' + id, {
      method: 'PUT',
      data: {
        title: title,
        details: details,
        lat: initialLocation.nb,
        lon: initialLocation.ob,
        updateType: 'complete'
      }
    }).done(function(data) {
      // Hiding the popup modal
      hideModal();
      // Resetting the thread window on the index page
      $('#thread').empty();
      // Adding the start a new thread on the window
      fetchCurrent(setCurrent);
    });
  });
};

// Shows the choices of deeds when joining or starting a thread
var showChoices = function() {
  var template = JST['templates/new_post']
  $('#overlayWindow').append(template);
  // Getting all the deeds from the db
  populatePage(modalLists);
  showModal();
};

// Setting current thread details or a button if not currently on a thread
var setCurrent = function(data) {
  // If not currently on a thread, a new button is appended
  if(data.id === 'null') {
    $('#thread').append("<button id='startThread'>Start a Thread</button>")
  } else { // If on a current thread the post details are displayed
    var template = JST['templates/current_deed']({current: data});
    $('#thread').append(template);
    // Getting the thread locations to be plotted
    $.ajax('/posts/populate_map', {
      data: { post_id: data.id },
      method: 'GET'
    }).done(function(data) {
      // Creating a function to make sure map is loaded then add markers
      var checkMap = function() {
        var mapIcon;
        // Setting the map icon based on whether deed is current or already completed
        _.each(data, function(d) {
          if(d.complete === true) {
            mapIcon = 'marker_heart.png';
          } else {
            mapIcon = 'current_marker_heart.png';
          }
          // Setting the location where deed was or is being done
          var location = new google.maps.LatLng(d.lat, d.lon)
          // Calling the placeMarker function to add a marker at the location
          placeMarker(location, d, mapIcon);
        });
        // Checking to see if map is loaded, and recalling itself if the page isnt loaded
        if(map === undefined) {
          setTimeout(checkMap, 200);
        }
      }
      // Calling the checkMap function to place all the locations for the thread
      checkMap();
    });
  }
};

// Getting the current post, then performing the passed in function with the data returned
var fetchCurrent = function(setCurrent) {
  $.get('/posts/current').done(function(data) {
    setCurrent(data);
  });
};


/*****************************************/
/******* Confirmation modal events *******/
/*****************************************/

// Function to clear the queue value on both the client and the server side
var queueReset = function() {
  $.get('/posts/reset');
  gon.queue = false;
};

// Clears and hides the modal, clears the queue when window is closed with the close window button
var assignCloseConfirmModal = function() {
  $('#overlayWindow').on('click', '.closeConfirmModal', function(e) {
    e.preventDefault();
    // Hiding the popup modal
    hideModal();
    // Resetting the queue
    queueReset();
  });
};

// Clears and hides the modal, clears the queue when the user declines to change threads
var assignConfirmDecline = function() {
  $('#overlayWindow').on('click', '.decline', function(e) {
    e.preventDefault();
    // Hiding the popup modal
    hideModal();
    // Resetting the queue
    queueReset();
  });
};

// Clears and hides the modal, clears the queue when the user declines to change threads
var assignConfirmAccept = function() {
  $('#overlayWindow').on('click', '.accept', function(e) {
    e.preventDefault();
    // Clearing the modal contents
    $('#overlayWindow').empty();
    // Showing the deed list choices
    var template = JST['templates/new_post']
    $('#overlayWindow').append(template);
    // Getting all the deeds from the db
    populatePage(modalLists);
    // Resetting the queue
    queueReset();
  });
};


/***********************************/
/******* Current post events *******/
/***********************************/

// Initializing a counter to make sure at least one invite is sent when completing a post
var inviteCounter = 0;

// Event for when user initiates a COMPLETED deed post flow
var assignPostComplete = function() {
  $('#thread').on('click', '#postComplete', function(e) {
    e.preventDefault();
    // Adding the complete post modal
    fetchCurrent(makePostModal);
    // Adding the person's contacts if they exist or the import google button
    fetchContacts();
    // Making popup modal visible and moving it into position on the screen
    showModal();
  });
};

// Event for when user hits the close modal button (the core functionality is the hide modal function. The rest of the code refers to the case when a user is closing the modal of the update post flow)
var assignCloseModal = function() {
  $('#overlayWindow').on('click', '.closeModal', function(e) {
    e.preventDefault();
    // If invite has been sent, then the deed is marked as completed so the thread modal needs to be reset
    if(inviteCounter > 0) {
      // If invite is sent then the post needs to be posted on facebook
      var post_id = $('.modalMain').data('id');
      $.ajax('/posts/finish_post/' + post_id, {
        method: 'PUT',
        data: {
          updateType: 'complete'
        }
      });
      // Resetting the thread window on the index page
      $('#thread').empty();
      // Adding the start a new thread on the window
      fetchCurrent(setCurrent);
    }
    // Hiding the popup modal
    hideModal();
    // Reset the invite counter
    inviteCounter = 0;
  });
};

// Event to submit to the db the final post details and save as complete, ONLY if at least one invite has been sent
var assignFinish = function() {
  $('#overlayWindow').on('click', '.updatePost', function(e) {
    e.preventDefault();
    // Clearing any existing errors
    $('.postErrors').empty();
    // Making sure at least one invite is sent
    if(inviteCounter === 0) {
      $('.postErrors').append('<p>Sorry! You must invite at least one person</p>')
    } else {
      // Getting the current post and passing in a function to update the finished post
      fetchCurrent(finishPost);
    }
  });
};

// Event for when the user invites a contact
var assignInvite = function() {
  $('#overlayWindow').on('click', '.invite', function() {
    // Setting the current button to a variable
    var current = $(this);
    // Getting the id of the contact, as well as the id of the thread the user is currently on
    var friend_id = current.data('id');
    var thread_id = $('#currentDeed').data('id');
    // Hiding the invite button and giving inital send message
    current.parent().append('<h4 class="sent">Invite being sent!</h4>');
    current.hide();
    // Making the ajax call to send the email for this person
    $.ajax('/posts/invite', {
      data: {
              thread: thread_id,
              friend: friend_id
            }
    }).done(function(data) {
      // If the invite is successfully sent
      if(data === 'ok') {
        // Getting the values of te form fields in case the user changed these values
        var details = $('#deedDetails').val();
        var title = $('#postTitle').val();
        // Getting the current post id
        var current_id = $('.modalMain').data('id');
        // Making call to update the post as complete, but NOT post to facebook
        navigator.geolocation.getCurrentPosition(function(position) {
          initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
          $.ajax('/posts/finish_post/' + current_id, {
            method: 'PUT',
            data: {
              title: title,
              details: details,
              lat: initialLocation.nb,
              lon: initialLocation.ob,
              updateType: 'invite'
            }
          });
        });
        // Removing the invite button and adding a sent message once the invitation was sent (need to check for success still)
        $('.sent').text('Invite sent!');
        current.remove();
        // Updating the counter so the post can be submitted as complete to facebook
        inviteCounter += 1;
        // Clearing error messages
        $('.postErrors').empty();
      }
    });
  });
};

// Event for when a user wants to start a thread
var assignStart = function() {
  $('#thread').on('click', '#startThread', function(e) {
    e.preventDefault();
    showChoices();
  });
};

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
      // Creating and appending the deed details to the entry details div
      var template = JST['templates/deed_details']({ details: data });
      $('.entryDetails').append(template);
      // debugger
    });
  });
};

// Event in the show details flow for when the user hits the back button
var assignBack = function() {
  $('#overlayWindow').on('click', '.back', function(e) {
    e.preventDefault();
    // Reshows the lists div and clears out the entry details div
    $('.lists').show();
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
          $('#thread').prepend("<p class='error'>Post was unable to be saved. Please try again</p>")
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

// Make a call to the posts/current to find the user's current post and thread
var getCurrent = function() {
  fetchCurrent(setCurrent);

  // When the user wants to post that they have finished the deed and hit Post as Complete
  assignPostComplete();

  // Close modal
  assignCloseModal();

  // Finish a Post
  assignFinish();

  // When an invite is clicked, an ajax call is made to email an invite to the corresponding contact
  assignInvite();

  // When clicked, a modal pops up with a start a new thread form
  assignStart();

  // When clicked, the deeds lists are hidden and the deed details of deed clicked are made visible
  assignShowDetails();

  // When clicked the deeds list is shown again and the entry details div is emptied
  assignBack();

  // When clicked the an ajax call is made to save the new post to the db
  assignSavePost();

  // Assigning the behaviors for the confirmation modal
  assignCloseConfirmModal();
  assignConfirmDecline();
  assignConfirmAccept();

  // If there is a current queue a modal is triggered
  if(gon.queue == true) {
    // Checking to see if the user is currently on a thread
    $.get('/posts/current').done(function(data) {
      if(data.id === 'null') {
        showChoices();
      } else {
        // Showing a confirmation modal so user can decide it they want to switch deed threads
        var template = JST['templates/confirm'];
        $('#overlayWindow').append(template);
        showModal();
      }
    });

  }
};


