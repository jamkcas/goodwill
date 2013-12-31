/******************************/
/******* Event Handlers *******/
/******************************/

var assignEvents = function() {

  /******************************/
  /******* Modal Handlers *******/
  /******************************/

  // Event for when user hits the close modal button (the core functionality is the hide modal function. The rest of the code refers to the case when a user is closing the modal of the update post flow)
  $('.overlayWindow').on('click', '.closeModal', function(e) {
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
      $('.thread').empty();
      // Adding the start a new thread on the window
      fetchCurrent('thread', setCurrent);
    }
    // Reset the invite counter
    inviteCounter = 0;

    // Hiding the popup modal
    hideModal();

    // Resetting the queue
    queueReset();

  });

  // Changing the position of the modal on scroll
  $(window).on('scroll', function() {
    // Only changes modal position when its visible
    if($('.overlay').css('visibility') === 'visible') {
      $('.overlayWindow').css('top', $(window).scrollTop() - 50);
    }
  });


  /******************************/
  /******* Hover Handlers *******/
  /******************************/

  // Hover events for when the user hovers on an entry
  $('.container').on('mouseenter', '.deedClickable', function() {
    $(this).parent().parent().css('background', '#E8EAEB');
  });

  // Resettingthe hover events when the user hovers away from an entry
  $('.container').on('mouseleave', '.deedClickable', function() {
    $(this).parent().parent().css('background', 'white');
  });


  /***************************************/
  /******* Current Thread Handlers *******/
  /***************************************/

  $('.thread').on('click', '.postComplete', function() {
    modalSize(0.5);
    // Adding the complete post modal
    fetchCurrent('modal', makePostModal);
    // Adding the person's contacts if they exist or the import google button
    fetchContacts();
    // Making popup modal visible and moving it into position on the screen
    showModal();
  });

  $('.overlayWindow').on('click', '.updatePost', function(e) {
    e.preventDefault();
    // Clearing any existing errors
    $('.postErrors').empty();
    // Making sure at least one invite is sent
    if(inviteCounter === 0) {
      $('.postErrors').append('<p>Sorry! You must invite someone to complete your post. Thanks!</p>')
    } else {
      // Getting the current post and passing in a function to update the finished post
      fetchCurrent('null', finishPost);
    }
  });

  // Puts an event on the signin button so it can be auto-triggered (for when joining a thread via email link)
  $('#user_nav').on('click', '#signin', function() {
    window.location.href = $('#signin').attr('href');
  });

  $('.thread').on('click', '.changeDeed', function() {
    showChoices(true);
  });

  $('.thread').on('click', '.showCurrent', function() {
    var id = $(this).data('id');
    getDeed(id, 'current');
  });


  /*******************************/
  /******* Invite Handlers *******/
  /*******************************/

  // Importing google contacts
  $('.overlayWindow').on('click', '.googleContacts', function() {
    importGoogle();
  });

  $('.overlayWindow').on('click', '.invite', function() {
    // Setting the current button to a variable
    var current = $(this);
    // Getting the id of the contact, as well as the id of the thread the user is currently on
    var friend_id = current.data('id');
    var thread_id = $('.currentDeed').data('id');
    // Setting initail calue of addedEmail
    var email = 'null';

    // Grabbing the email if one is entered manually
    if(current.hasClass('addedEmail')) {
      email = $('#email').val();
    }

    // Clearing error messages
    $('.postErrors').empty();

    // Hiding the invite options and giving the initial invite message
    $('.inviteMessage').append('<h4 class="sent">Invite being sent!</h4>');
    $('.inviteWindow').hide();

    /**************************************************************/
    /*** This is for the multi-person invite flow in the future ***/
    /**************************************************************/

    // // Hiding the invite button and giving inital send message
    // current.parent().append('<h4 class="sent">Invite being sent!</h4>');
    // current.hide();

    /**************************************************************/
    /*** This is for the multi-person invite flow in the future ***/
    /**************************************************************/

    // Making the ajax call to send the email for this person
    $.ajax('/posts/invite', {
      data: {
              thread: thread_id,
              friend: friend_id,
              email: email
            }
    }).done(function(data) {
      // If the invite is successfully sent a post is made to update post as complete
      if(data === 'ok') {
        // Getting the values of the form fields in case the user changed these values
        var details = $('#deedDetails').val();
        var title = $('#postTitle').val();
        // Getting the current post id
        var current_id = $('.modalMain').data('id');
        // Making call to update the post as complete, but NOT post to facebook
        postAsComplete(current_id, title, details, 'invite');
        // Removing the invite button and adding a sent message once the invitation was sent (need to check for success still)
        $('.sent').text('Invite sent!');
        // current.remove(); /*** Also for multi person invites in the future ***/
        // Updating the counter so the post can be submitted as complete to facebook
        inviteCounter += 1;
      }
    });
  });


  /*************************************/
  /******* Accept Modal Handlers *******/
  /*************************************/

  // Clears and hides the modal, clears the queue when the user declines to change threads
  $('.overlayWindow').on('click', '.decline', function() {
    // Hiding the popup modal
    hideModal();
    // Resetting the queue
    queueReset();
  });

  // Clears and hides the modal, clears the queue when the user declines to change threads
  $('.overlayWindow').on('click', '.accept', function() {
    var id = $(this).data('id');
    if(id === null) {
      // Clearing the modal contents
      $('.window').empty();
      // Showing the deed choices
      showChoices();
    } else {
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
          // Sets the queue to false if a post was created
          gon.queue = false;
          // The thread div is emptied (start thread button removed)
          $('.thread').empty();
          // The fetch current function is called to set the contents of the thread div to the current posts details
          fetchCurrent('thread', setCurrent);
        });
      });
    }
  });


  /*************************************/
  /******* Start Thread Handlers *******/
  /*************************************/

  // Event for when a user wants to start a thread
  $('.thread').on('click', '.startThread', function() {
    showChoices();
  });

  // Event for paginating deeds
  $('.overlayWindow').on('click', '.paginate', function() {
    // Grabbing the current button
    var button = $(this);
    // Fading out the current list
    $('.list').fadeOut(500, function() {
      if(button.hasClass('next')) {
        // Populating the list with the next up to 8 messages and fading them in
        if(button.hasClass('d')) {
          populate(deeds[0], deedCounter, deedCounter + 8, 'd');
        } else if(button.hasClass('s')) {
          populate(deeds[1], deedCounter, deedCounter + 8, 's');
        } else {
          populate(deeds[2], deedCounter, deedCounter + 8, 'l');
        }
      } else {
        // Populating the list with the previous 8 messages and fading them in
        if(button.hasClass('d')) {
          populate(deeds[0], deedCounter - 16, deedCounter - 8, 'd');
        } else if(button.hasClass('s')) {
          populate(deeds[1], deedCounter - 16, deedCounter - 8, 's');
        } else {
          populate(deeds[2], deedCounter - 16, deedCounter - 8, 'l');
        }
      }
    });
  });

  // Event for setting the current active tab, and populating the list with the currently selected category
  $('.overlayWindow').on('click', '.listNav', function() {
    // Resetting the deed counter because a new category was selected
    deedCounter = 0;
    // Removing the active class from whatever was active
    $('.listNav').removeClass('active');
    // Grabbing the current tab that was selected
    var nav = $(this);
    // Setting the currently selected tab to active state
    nav.addClass('active');
    // Fading out the current deed list, removing them, then populating the list with the new deeds
    $('.list').fadeOut(500, function() {
      $('.list').empty();
      if(nav.hasClass('donations')) {
        populate(deeds[0], deedCounter, deedCounter + 8, 'd');
      } else if(nav.hasClass('services')) {
        populate(deeds[1], deedCounter, deedCounter + 8, 's');
      } else {
        populate(deeds[2], deedCounter, deedCounter + 8, 'l');
      }
    });
  })


  /*************************************/
  /******* Show Details Handlers *******/
  /*************************************/

  // Display deed details when click on a deed in the start thread modal
  $('.overlayWindow').on('click', '.deedClickable', function() {
    // Getting the deed id
    var id = $(this).parent().data('id');
    // Call to get the deed details
    $.ajax('/deeds/' + id, {
      data: {
        ajax: 'This is an ajax call'
      }
    }).done(function(data) {
      // Hiding the rest of the modal contents
      $('.modalHeader').hide();
      $('.deedNav').hide();
      $('.lists').hide();
      // Shrinking the modal size for the details display
      modalSize(0.5);
      // Showing deed details
      var template = JST['templates/deed_details']({details: data});
      $('.entryDetails').append(template);
    });
  });

  // Event to go back to the deed list modal
  $('.overlayWindow').on('click', '.back', function() {
    // Removing the current deed details
    $('.entryDetails').empty();
    // Increasing the modal size to accomocate the deeds list
    modalSize(0.7);
    // Showing the deeds list, the nav bar, and the title
    $('.modalHeader').show();
    $('.deedNav').show();
    $('.lists').show();
  })

  // Event for when a person first starts a post or changes to a new one
  $('.overlayWindow').on('click', '.submitPost', function() {
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
          $('.thread').prepend("<p class='error'>Post was unable to be saved. Please try again.</p>")
        } else {
          // Sets the queue to false if a post was created
          gon.queue = false;
          // The thread div is emptied (start thread button removed)
          $('.thread').empty();
          // The fetch current function is called to set the contents of the thread div to the current posts details
          updateCurrent();
        }
      });
    });
  });

  $('.localFeatured').on('click', '.featuredStart', function() {
    // Getting the deed id
    var id = $(this).data('id');
    // Call to get the deed details
    getDeed(id);
  });


  /*****************************/
  /******* Vote Handlers *******/
  /*****************************/

  // Up vote handler
  $('.container').on('click', '.upVote', function() {
    // Grabbing the data id of the deed being voted on
    var vote_id = $(this).data('id');
    // Setting the vote instance variable for use in the ajax callback
    var current_vote = $(this);
    var category = $('.active').data('type');
    $.ajax('/votes/save_vote', {
      method: 'POST',
      data: {
              vote_type: 'up',
              id: vote_id,
              votable_type: 'Deed'
            }
    }).done(function(data) {
      // Getting the old vote count
      oldTotal = current_vote.children(1).text();
      // Adding the new vote to the vote count
      new_total = parseInt(oldTotal) + parseInt(data)
      // Setting the new vote count to display
      current_vote.children(1).text(new_total);
      // Removing both voting buttons so the current user cant vote again
      current_vote.removeClass('upVote');
      current_vote.next().removeClass('downVote');
      // Refreshing the votes on the page
      refreshVoteTotals(category);
    });
  });

  // Down vote handler
  $('.container').on('click', '.downVote', function() {
    var vote_id = $(this).data('id');
    // Setting the vote instance varaible for use in the ajax callback
    var current_vote = $(this);
    var category = $('.active').data('type');
    $.ajax('/votes/save_vote', {
      method: 'POST',
      data: {
              vote_type: 'down',
              id: vote_id,
              votable_type: 'Deed'
            }
    }).done(function(data) {
      // Getting the old vote count
      oldTotal = current_vote.children(1).text();
      // Adding the new vote to the vote count
      new_total = parseInt(oldTotal) + Math.abs(parseInt(data));
      // Setting the new vote count to display
      current_vote.children(1).text(new_total);
      // Removing both voting buttons so the current user cant vote again
      current_vote.prev().removeClass('upVote');
      current_vote.removeClass('downVote');
      // Refreshing the votes on the page
      refreshVoteTotals(category);
    });
  });


  /**********************************/
  /******* Suggested Handlers *******/
  /**********************************/

  $('.suggestedDeedsContainer').on('click', '.leftArrow', function() {
    // Combining the deed list arrays to one list
    var totalDeeds = deeds[0].concat(deeds[1]).concat(deeds[2]);
    // Setting the next deed
    if(deedIndex + 5 > totalDeeds.length - 1) {
      var deed = totalDeeds[0 + (deedIndex + 5) - (totalDeeds.length - 1)];
    } else {
      var deed = totalDeeds[deedIndex + 5];
    }
    // Cloning the deed, bringing it to the front, and positioning it so it can be animated
    var deedList = $('.suggestedDeeds').clone();
    deedList.css('position', 'absolute');
    deedList.css('z-index', '100');
    deedList.css('background', 'white');
    // Adding it to the frame
    $('.suggestedDeedsFrame').append(deedList);
    // Moving the clone. When it is done moving the first deed is removed and a new deed is added on the end. Then the deedIndex is updated and the clone is deleted
    deedList.animate({'left': '-20%'}, {'complete': function() {
        $('.suggestedDeeds').children()[0].remove();
        addDeedToList(deed, '.suggestedDeeds');
        if(deedIndex === totalDeeds.length - 1) {
          deedIndex = 0;
        } else {
          deedIndex += 1;
        }
        deedList.remove();
      }
    });
  });

  $('.suggestedDeedsContainer').on('click', '.rightArrow', function() {
    // Combining the deed list arrays to one list
    var totalDeeds = deeds[0].concat(deeds[1]).concat(deeds[2]);
    // Setting the next deed
    if(deedIndex - 1 < 0) {
      var deed = totalDeeds[totalDeeds.length - 1];
    } else {
      var deed = totalDeeds[deedIndex];
    }
    // Cloning the deed, bringing it to the front, and positioning it so it can be animated
    var deedList = $('.suggestedDeeds').clone();
    deedList.css('position', 'absolute');
    deedList.css('z-index', '100');
    deedList.css('background', 'white');
    // Adding it to the frame
    $('.suggestedDeedsFrame').append(deedList);
    // Moving the clone. When it is done moving the last deed is removed and a new deed is added on the beginning. Then the deedIndex is updated and the clone is deleted
    deedList.animate({'left': '20%'}, {'complete': function() {
        $('.suggestedDeeds').children()[4].remove();
        var template = JST['templates/deed_entry']({data: deed});
        $('.suggestedDeeds').prepend(template);
        if(deedIndex === 0) {
          deedIndex = totalDeeds.length - 1;
        } else {
          deedIndex -= 1;
        }
        deedList.remove();
      }
    });
  });

  // Display the deed details in a modal
  $('.suggestedDeeds').on('click', '.deedClickable', function() {
    // Getting the deed id
    var id = $(this).parent().data('id');
    // Call to get the deed details
    getDeed(id);
  });


  /*********************************/
  /******* Add Deed Handlers *******/
  /*********************************/

  // When the add a deed button is clicked the new deed form is displayed in the modal
  $('.addDeedLink').on('click', function() {
    var template = JST['templates/add_deed'];
    $('.window').append(template);
    modalSize(0.7);
    // Setting the size of the input to be that of the div containing it(so the entire div is clickable for file input)
    var width = $('.upload').width();
    var height = $('.upload').height();
    $('#deedPicture').css('width', width);
    $('#deedPicture').css('height', height);

    var imageHeight = $('.deedImage').width() * 0.61;
    $('.deedImage').css('height', imageHeight);
    var margin = (imageHeight / 2) - (height / 2);
    console.log(margin)
    $('.upload').css('margin-top', margin);
    showModal();
  });

  // Function to check if valid email format
  var checkUrl = function(str) {
    var pattern = /[\d\D]+\.[a-z]{2,3}$/;
    if(str.match(/\s/)) {
      return false;
    }
    if(str.match(pattern)) {
      return true;
    }
  };

  // Function to check if valid zipcode format
  var checkZip = function(zip) {
    var pattern = /[\d]{5}/;
    if(zip.match(pattern) && zip.length === 5) {
      return true;
    }
  };

  // Function for adding an error message when mandatory field is blank
  var missingField = function(elem) {
    elem.next().empty();
    elem.css('box-shadow', '0.5px 0.5px 5px 1px red');
    elem.next().append('<p>* Required Field</p>');
  };

  // Function for clearing error messages
  var clearMessage = function(elem) {
    elem.css('box-shadow', 'none');
    elem.next().empty();
    if(elem.next().next()) {
      elem.next().next().show();
    }
  };

  // Function for adding an error message when url is an invalid format
  var invalidUrl = function(elem) {
    elem.css('box-shadow', '0.5px 0.5px 5px 1px red')
    elem.next().append('<p>* Invalid URL</p>');
    elem.next().next().hide();
  };

  // Function for adding an error message when zip is an invalid format
  var invalidZip = function(elem) {
    elem.css('box-shadow', '0.5px 0.5px 5px 1px red');
    elem.next().append('<p>* Invalid Zipcode</p>');
    elem.next().next().hide();
  };

  // Event for saving a new deed
  $('.overlayWindow').on('click', '#submitDeed', function() {
    // Initializing all statuses as true. If any get changed to false then an error has occurred and the deed wont be saved
    var deedStatus = true;
    var urlStatus = true;
    var zipStatus = true;

    // If the url field has been filled in then a check is made to see if the url is of a correct format. If not the urlStatus is set to false to prevent deed from being saved
    if($('#deedUrl').val() != '') {
      clearMessage($('#deedUrl'));
      if(!(checkUrl($('#deedUrl').val()))) {
        invalidUrl($('#deedUrl'));
        urlStatus = false;
      }
    } else {
      clearMessage($('#deedUrl'));
    }

    // If the location field has been filled in then a check is made to see if the zipcode is of a correct format. If not the zipStatus is set to false to prevent deed from being saved
    if($('#deedLocation').val() != '') {
      clearMessage($('#deedLocation'));
      if(!(checkZip($('#deedLocation').val()))) {
        invalidZip($('#deedLocation'));
        zipStatus = false;
      }
    } else {
      clearMessage($('#deedLocation'));
    }

    // If any of the mandatory fields arent filled in then deedStatus is set to false to prevent the deed from being saved
    $('.mandatory').each(function() {
      clearMessage($(this));
      if($(this).val() === '') {
        missingField($(this));
        deedStatus = false;
      }
    });

    // If no errors then all the field values are sent to the db to be saved in a new deed
    if(deedStatus && urlStatus && zipStatus) {
      var title = $('#deedTitle').val();
      var description = $('#deedDescription').val();
      var contact = $('#deedContact').val();
      var url = $('#deedUrl').val();
      var location = $('#deedLocation').val();
      // var picture = $('#deedPicture').val();
      var category = $('#deedCategory').val() || 'donation';
      $.ajax('/deeds', {
        method: 'POST',
        data: {
          title: title,
          description: description,
          contact: contact,
          url: url,
          location: location,
          category: category
        }
      }).done(function(data) {
        console.log(data);
        hideModal();
      });
    } else {
      // Event listener to reset the webkit animation name to nothing when the animation ends
      $('#submitDeed')[0].addEventListener('webkitAnimationEnd', function(){
        this.style.webkitAnimationName = '';
      }, false);
      // If any errors are made then the shake animation is attached to the button to notify the user that errors exist
      $('#submitDeed').css('-webkit-animation-name', 'shakes');
    }
  });

  // Event to check if a mandatory field is blank when user tabs out of it. If so an error message is shown
  $('.overlayWindow').on('keydown', '.mandatory', function(e) {
    if(e.which === 9) {
      if($(this).val() === '') {
        missingField($(this));
      } else {
        clearMessage($(this));
      }
    }
  });

  // Event to check if a url is not of the correct format. If so an error message is shown
  $('.overlayWindow').on('keydown', '#deedUrl', function(e) {
    if(e.which === 9) {
      clearMessage($(this));
      if($(this).val() != '') {
        if(!(checkUrl($('#deedUrl').val()))) {
          invalidUrl($(this));
        }
      }
    }
  });

  // Event to check if a zip is not of the correct format. If so an error message is shown
  $('.overlayWindow').on('keydown', '#deedLocation', function(e) {
    if(e.which === 9) {
      clearMessage($(this));
      if($(this).val() != '') {
        if(!(checkZip($('#deedLocation').val()))) {
          invalidZip($(this));
        }
      }
    }
  });
// onchange="readURL(this);

  $('.overlayWindow').on('change', '#deedPicture', function() {
    var template = JST['templates/picture_canvas'];
    $('.window').append(template);
    var width = $('.window').width();
    var height = $('.window').height();
    $('.pictureCanvas').css('width', width);
    $('.pictureCanvas').css('height', height);
    readURL($(this)[0]);
  });

};

var readURL = function(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function(e) {
      $('.inputImage').attr('src', e.target.result);
      var width = $('.window').width();
      var height = $('.window').height();

      console.log(Math.abs($('.inputImage').width() - width))
      console.log(Math.abs($('.inputImage').height() - height))
      if(Math.abs($('.inputImage').height() - height) > Math.abs($('.inputImage').width() - width)) {
        $('.inputImage').css('height', '100%');
      } else {
        $('.inputImage').css('width', '100%');
      }
    };

    reader.readAsDataURL(input.files[0]);
  }
}