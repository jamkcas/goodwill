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


  /***************************************/
  /******* Current Thread Handlers *******/
  /***************************************/

  $('.thread').on('click', '.postComplete', function() {
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

  // Hover events for when the user hovers on an entry
  $('.overlayWindow').on('mouseenter', '.deedClickable', function() {
    $(this).parent().parent().css('background', '#E8EAEB');
  });

  // Resettingthe hover events when the user hovers away from an entry
  $('.overlayWindow').on('mouseleave', '.deedClickable', function() {
    $(this).parent().parent().css('background', 'white');
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

  // $('.bottom').on('click', '.featuredEntry', function(){
  //   var current = $(this);
  //   var post_id = null
  //   var id = current.data('id');
  //   if($('#currentDeed').data('id')) {
  //     post_id = $('#currentDeed').data('id')
  //   }
  //   $.get('/deeds/' + id).done(function(data) {
  //     var template = JST['templates/details_page']({details: data, post_id: post_id});
  //     $('#overlayWindow').append(template);
  //     showModal();
  //   });
  // });

  // $('.container').on('click', '.deedEntry', function() {

  //   var current = $(this);
  //   var post_id = null
  //   var id = current.parent().data('id');
  //   if($('#currentDeed').data('id')) {
  //     post_id = $('#currentDeed').data('id')
  //   }
  //   $.get('/deeds/' + id).done(function(data) {
  //     $('#overlayWindow').empty();
  //     var template = JST['templates/details_page']({details: data, post_id: post_id});
  //     $('#overlayWindow').append(template);
  //     showModal();
  //   });
  // });



  /************************************/
  /******* Mouse Hover Handlers *******/
  /************************************/


  // $('.container').on('click', '.change', function() {
  //   var id = $(this).data('id');
  //   var template = JST['templates/confirm']({id: id});
  //   $('#overlayWindow').empty();
  //   $('#overlayWindow').append(template);
  // });

  // $('.container').on('click', '.changeDeed', function() {
  //   var id = $(this).data('id');
  //   var template = JST['templates/new_post'];
  //   $('#overlayWindow').append(template);
  //   populatePage(modalLists);
  //   showModal();
  // });

  // $('#thread').on('click', '.showCurrent', function() {
  //   var id = $(this).data('id');
  //   $.get('/deeds/' + id).done(function(data) {
  //     var template = JST['templates/details_page']({details: data, post_id: null});
  //     $('#overlayWindow').append(template);
  //     showModal();
  //   });
  // });
  // $('.container').on('click', '.moreDonations', function(){
  //   populatePage(fullList, 'donation');
  // });
  // $('.container').on('click', '.moreServices', function(){
  //   populatePage(fullList, 'service');
  // });
  // $('.container').on('click', '.moreLocal', function(){
  //   populatePage(fullList, 'local');
  // });



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

};