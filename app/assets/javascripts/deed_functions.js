/**************************************/
/******* Deed utility functions *******/
/**************************************/

// Categorizing function
var categorize = function(data, category) {
  // Creating a new array to store only the categry type deeds
  var sorted = [];
  // Cycle through each deed and add the category type ones to the featured array
  _.each(data, function(d) {
    if(d.deed.category === category) {
      sorted.push(d);
    }
  });
  return sorted;
};
// Typifying function
var typify = function(data, type) {
  // Creating a new array to store only the categry type deeds
  var sorted = [];
  // Cycle through each deed and add the category type ones to the featured array
  _.each(data, function(d) {
    if(d.deed.deed_type === type) {
      sorted.push(d);
    }
  });
  return sorted;
};

// Sort votes function
var sortVotes = function(data) {
  var sort = _.sortBy(data, function(d) {
    return -d.score;
  });
  return sort;
};

// Clearing the lists (this is for when the votes are made in the modal view, to refresh the index page vote counts)
var emptyPage = function() {
  $('.featuredDonation').empty();
  $('.featuredService').empty();
  $('.featuredLocal').empty();
  $('.suggestedDeeds').empty();
}

// Function to show search filter options on hover
var showOptions = function() {
  $('.filterOptions').css('padding', '5px 0');
  $('.filterOptions').css('height', '100px');
  $('.filterOptions').css('border-bottom', '1px solid #E8EAEB');
};

// Function to hide search filter options when no longer hovering
var hideOptions = function() {
  $('.filterOptions').css('padding', '0');
  $('.filterOptions').css('height', '0');
  $('.filterOptions').css('border-bottom', 'none');
};

// Function for clearing the search results and repopulating the suggested deeds list
var clearSearchResults = function() {
  // Resetting the deed counter and results array
  deedCounter = 0;
  results = [];
  // Showing the deed category nav and hiding the search result dialog
  $('.listTypes').show();
  $('.searchResults').hide();
  // Repopulating the deeds list with the default deeds
  populate(deeds[0], deedCounter, deedCounter + 8, 'd');
};

// Function for finding and setting the deed that macth the search results
var getSearchResults = function(pattern) {
  var searchDeeds;
  // Setting the deeds to be searched based on the filter selected
  if($('.allOption').hasClass('selected')) {
    searchDeeds = deeds[0].concat(deeds[1]).concat(deeds[2]);
  } else if($('.donationOption').hasClass('selected')) {
    searchDeeds = deeds[0];
  } else if($('.serviceOption').hasClass('selected')) {
    searchDeeds = deeds[1];
  } else {
    searchDeeds = deeds[2];
  }

  // Searching the deed titles for the entered search parameters based on the filter applied
  _.each(searchDeeds, function(d) {
    // Setting the title to lowercase to avoid case sensitivity
    var title = d.deed.title.toLowerCase();
    // If the deed title contains the search parameter the deed is pushed into the results array
    if(title.match(pattern)) {
      results.push(d);
    }
  });

  // Populating the list with the results array
  populate(results, deedCounter, deedCounter + 8, 'r');

  // Hiding the list nav and showing the results dialog
  $('.listTypes').hide();
  // If there is no results, then a no message result is shown. Otherwise a 'search for results...' message is shown. Both messages are limited to 25 characters for the search term display
  if(results.length === 0) {
    if(pattern.length > 25) {
      $('.searchKeywords')[0].textContent = 'No results found for "' + pattern.slice(0, 25) + '..."';
    } else {
      $('.searchKeywords')[0].textContent = 'No results found for "' + pattern + '"';
    }
  } else {
    if(pattern.length > 25) {
      $('.searchKeywords')[0].textContent = 'Search results for "' + pattern.slice(0, 25) + '..."';
    } else {
      $('.searchKeywords')[0].textContent = 'Search results for "' + pattern + '"';
    }
  }
};


/********************************/
/******* Canvas functions *******/
/********************************/

var loadImage = function() {
  var input, file, fr, img, ctx, canvas, theSelection, errors = [];
  // Grabbing the file input
  input = document.getElementById('deedPicture');
  // Grabbing the input value
  file = input.files[0];
  // Creating a new file
  fr = new FileReader();
  // When the new file is loaded a new image is created with the formatted file data
  fr.onload = createImage;
  // Formutting the file data to create an image source
  fr.readAsDataURL(file);

  function createImage() {
    // Creating a new image and setting the source to the image that is uploaded
    img = new Image();
    img.onload = imageLoaded;
    img.src = fr.result;
    if(img.width < 325) {
      errors.push("Width is too small");
    }
    if(img.width > 900) {
      errors.push("Width is too big");
    }
    if(img.height < 183) {
      errors.push("Height is too small");
    }
    if(img.height > 510) {
      errors.push("Height is too big");
    }
  }

  var imageLoaded = function() {
    // Grabbing the canvas
    canvas = document.getElementById("panel");
    // Setting the context of the canvas
    ctx = canvas.getContext("2d")
    // Creating a new selection
    theSelection = new Selection(0, 0, 325, 183);
    // Checking if there are any errors
    if(errors.length > 0) {
      // Clearing the uploaded file value
      $('#deedPicture').val('');
      _.each(errors, function(err) {
        // Displaying the error messages
        $('.imageDeedErrors').append('<p>' + err + '</p>');
        // Highlighting the errors, so user knows specifically what to change
        if(err.match(/Width/) && err.match(/small/)) {
          $('.minW').css('color', 'red');
        }
        if(err.match(/Width/) && err.match(/big/)) {
          $('.maxW').css('color', 'red');
        }
        if(err.match(/Height/) && err.match(/small/)) {
          $('.minH').css('color', 'red');
        }
        if(err.match(/Height/) && err.match(/big/)) {
          $('.maxH').css('color', 'red');
        }
      });
    } else {
      // Displaying the canvas
      $('.addCanvas').css('display', 'block');
      // Increasing modal size if the image is bigger than the current modal size
      if(img.width > 740 && img.width <= 860) {
        modalSize(0.8);
      }
      if(img.width > 860) {
        modalSize(0.9);
      }

      // Setting canvas dimensions
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw the canvas
      drawScene();

      // Hiding the deed details to only show the canvas
      $('.deedInputInfo').hide();
      $('.deedImage').hide();
      $('.newDeedHeader').hide();
    }

    // Event for when selection or scalar status is true and user moves the mouse
    $('.overlayWindow').on('mousemove', '#panel', function(e) {
      var canvasOffset = $(canvas).offset();
      // Getting the x and y coordinates of the mousemove in relation to the canvas
      iMouseX = Math.floor(e.pageX - canvasOffset.left);
      iMouseY = Math.floor(e.pageY - canvasOffset.top);

      // In case of dragging the whole selection window
      if(theSelection.bDragAll) {
        // Setting the new x offset on mouse move on the horizontal axis
        theSelection.x = iMouseX - theSelection.px;
        // If the x offset is less than zero then the x offset is set to zero to prevent selection window from going off the canvas
        if(theSelection.x < 0) {
          theSelection.x = 0;
        }
        // If the x offset and the selection window width is greater than canvas width then the x offset is set to canvas width minus the selection width to prevent selection window from going off the canvas
        if(theSelection.x + theSelection.w > canvas.width) {
          theSelection.x = canvas.width - theSelection.w;
        }

        // Setting the new x offset on mouse move on the horizontal axis
        theSelection.y = iMouseY - theSelection.py;
        // If the y offset is less than zero then the y offset is set to zero to prevent selection window from going off the canvas
        if(theSelection.y < 0) {
          theSelection.y = 0;
        }
        // If the y offset and the selection window height is greater than canvas height then the y offset is set to canvas height minus the selection height to prevent selection window from going off the canvas
        if(theSelection.y + theSelection.h > canvas.height) {
          theSelection.y = canvas.height - theSelection.h;
        }
      }
      // Clearing the Scalar hover status to false initially
      theSelection.hov = false;
      // Resetting the Scalar box size
      for(i = 0; i < 4; i++) {
        theSelection.iCSize[i] = theSelection.csize;
      }

      // When hovering over the Scalar, the hover status of the Scalar is set to true and the size of the Scalar increases
      if(iMouseX > theSelection.x + theSelection.w-theSelection.csizeh && iMouseX < theSelection.x + theSelection.w + theSelection.csizeh && iMouseY > theSelection.y + theSelection.h-theSelection.csizeh && iMouseY < theSelection.y + theSelection.h + theSelection.csizeh) {

        theSelection.hov = true;
        theSelection.iCSize[2] = theSelection.csizeh;
      }

      // If Scalar status is true then the selection window is scaled
      var iFW, iFH, newHeight;
      if(theSelection.scalar) {
        var iFX = theSelection.x;
        var iFY = theSelection.y;
        // Setting the new width
        iFW = iMouseX - theSelection.px - iFX;
        // Accounting for is the user tries to pull the scalar off the right side of the canvas
        if(iFW + theSelection.x > canvas.width) {
          iFW = canvas.width - iFX;
        }
        if(iFW < 325) {
          iFW = 325;
        }
        // Keeping the ratio the same when scaling
        newHeight = theSelection.h/theSelection.w * iFW;
        // Accounting for if the user tries to pull scalar off the bottom of the canvas
        if(newHeight + theSelection.y > canvas.height) {
          var yHeight = canvas.height - iFY;
          var xWidth = yHeight * iFW / newHeight;
          iFW = xWidth;
          newHeight = yHeight;
        }
        // Setting the new height
        iFH = newHeight;
      }
      // Setting the width and height of the selection window if the window is bigger than the Scalar cube
      if(iFW > theSelection.csizeh * 2 && iFH > theSelection.csizeh * 2) {
        theSelection.w = iFW;
        theSelection.h = iFH;

        theSelection.x = iFX;
        theSelection.y = iFY;
      }
      // Redrawing the scene with new window selection placement or size
      drawScene();
    });

    // Event for when user mouses down on the canvas
    $('.overlayWindow').on('mousedown', '#panel', function(e) {
      var canvasOffset = $(canvas).offset();
      // Getting the x and y coordinates of the mouseclick in relation to the canvas
      iMouseX = Math.floor(e.pageX - canvasOffset.left);
      iMouseY = Math.floor(e.pageY - canvasOffset.top);

      // Finding and setting the difference between the mouse click and the current selections x and y position
      theSelection.px = iMouseX - theSelection.x;
      theSelection.py = iMouseY - theSelection.y;
      // Taking in account the selection width and height when user clicks on the Scalar
      if(theSelection.hov) {
        theSelection.px = iMouseX - theSelection.x - theSelection.w;
        theSelection.py = iMouseY - theSelection.y - theSelection.h;
      }

      // Allows for selection window to be draggable if the user clicks within the selection window
      if(iMouseX > theSelection.x + theSelection.csizeh && iMouseX < theSelection.x+theSelection.w - theSelection.csizeh && iMouseY > theSelection.y + theSelection.csizeh && iMouseY < theSelection.y+theSelection.h - theSelection.csizeh) {

        theSelection.bDragAll = true;
      }

      // Allowing the Scalar to draggable only if the user is hovering over the Scalar cube when they mousedown
      if(theSelection.hov) {
        theSelection.scalar = true;
      }
    });

    // Event for when user mouses up on the canvas
    $('.overlayWindow').on('mouseup', '#panel', function(e) {
      // Resetting the drag status of the whole selection window to false
      theSelection.bDragAll = false;

      // Resetting the drag status of the scalar to false
      theSelection.scalar = false;

      theSelection.px = 0;
      theSelection.py = 0;
    });
  }

  $('.overlayWindow').on('click', '.crop', function(e) {
    getResults();
    $('.deedInputInfo').show();
    $('.deedImage').show();
    $('.newDeedHeader').show();
    $('.addCanvas').empty();
    $('.addCanvas').css('display', 'none');
    modalSize(0.7);
  });

  var drawScene = function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // clear canvas
    // Draw the image
    ctx.drawImage(img,0,0);

    // Grey out image
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Add the selection window
    theSelection.draw();
  }

  // define Selection constructor
  var Selection = function(x, y, w, h) {
    this.x = x; // initial positions
    this.y = y;
    this.w = w; // and size
    this.h = h;

    this.px = x; // extra variables to dragging calculations
    this.py = y;

    this.csize = 6; // Scalar size
    this.csizeh = 10; // Scalar hover size

    this.hov = false; // Scalar hover status
    this.iCSize = [this.csize, this.csize, this.csize, this.csize]; // resize cubes sizes
    this.scalar = false; // Scalar scale status
    this.bDragAll = false; // Entire selection drag status
  }

  // define Selection draw method
  Selection.prototype.draw = function() {
    // Outline of the selected part of the image
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x, this.y, this.w, this.h);

    // Redrawing the selected part of the image
    if(this.w > 0 && this.h > 0) {
      ctx.drawImage(img, this.x, this.y, this.w, this.h, this.x, this.y, this.w, this.h);
    }

    // Scalar cube
    ctx.fillStyle = '#fff';
    ctx.fillRect(this.x + this.w - this.iCSize[2], this.y + this.h - this.iCSize[2], this.iCSize[2] * 2, this.iCSize[2] * 2);
  }

  // Function to set the form display image to the cropped image from the canvas
  function getResults() {
    var temp_ctx, temp_canvas;
    temp_canvas = document.createElement('canvas');
    temp_ctx = temp_canvas.getContext('2d');
    temp_canvas.width = theSelection.w;
    temp_canvas.height = theSelection.h;
    temp_ctx.drawImage(img, theSelection.x, theSelection.y, theSelection.w, theSelection.h, 0, 0, theSelection.w, theSelection.h);
    var vData = temp_canvas.toDataURL();
    $('.croppedImage').attr('src', vData);
    // $('#results h2').text('Well done, we have prepared our cropped image, now you can save it if you wish');
  }
}


/*****************************************/
/******* Deed validation functions *******/
/*****************************************/

// Function to check if valid email format
var checkUrl = function(str) {
  var pattern1 = /[\d\D]+\.[a-z]{2,3}$/;
  var pattern2 = /[\d\D]+\.[a-z]{2,3}\/$/;
  if(str.match(/\s/)) {
    return false;
  }
  if(str.match(pattern1) || str.match(pattern2)) {
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

// Funtion for checking if a phone number is of a correct format
var checkPhone = function(num) {
  // Setting all the valid phone format patterns
  var pattern1 = /[\d]{3}\-[\d]{3}\-[\d]{4}/;
  var pattern2 = /\([\d]{3}\)[\d]{3}-[\d]{4}/;
  var pattern3 = /\([\d]{3}\)[\d]{7}/;
  var pattern4 = /[\d]{10}/;
  var pattern5 = /1-[\d]{10}/;
  var pattern6 = /1-[\d]{3}-[\d]{3}-[\d]{4}/;
  var pattern7 = /1-\([\d]{3}\)[\d]{3}-[\d]{4}/;
  var pattern8 = /1-\([\d]{3}\)[\d]{7}/;

  if(num.match(/\s/)) {
    return false;
  }

  if(num.match(pattern1) || num.match(pattern2) || num.match(pattern3) || num.match(pattern4) || num.match(pattern5) || num.match(pattern6) || num.match(pattern7) || num.match(pattern8)) {
    return true;
  }

};

// Function to check if email address is of a correct format
var checkEmail = function(email) {
  var pattern = /[\w\W]+\@\w+\.[a-zA-Z]{2,3}$/;
  if(email.match(/\s/)) {
    return false;
  }
  if(email.match(pattern)) {
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
  // If there is an info message associated with the field it is reshown when errors are cleared
  if(elem.next().next()) {
    elem.next().next().show();
  }
};

// Function for adding an error message when input value is an invalid format
var invalid = function(elem, message) {
  elem.css('box-shadow', '0.5px 0.5px 5px 1px red');
  elem.next().append('<p>' + message + '</p>');
  // Hiding the info message if there is an error
  elem.next().next().hide();
};


/******************************/
/******* List functions *******/
/******************************/

// Fetching all the deeds and using the passed in the proper list populating function
var populatePage = function(list, type) {
  // Getting all the deeds from the db
  $.get('/deeds').done(function(data) {
    list(data, type);
  });
};

// Function to add an individual entry into the current list
var addDeedToList = function(data, list) {
  // Creating a new list item by creating a data object and passing it into the deed_entry jst template
  if(list === '.list') {
    var template = JST['templates/deed_entry']({data: data, status: 'modal'});
  } else {
    var template = JST['templates/deed_entry']({data: data});
  }
  // Appending the template to the appropriate item
  $(list).append(template);
};

// Function to populate the list with active tab category deeds, and adding next/prev buttons as needed
var populate = function(data, start, end, type) {
  // Emptying out the current list after it is done fading out
  $('.list').empty();
  _.each(data.slice(start, end), function(d) {
    if(d) {
      addDeedToList(d, '.list');
    }
  });
  // Fading in the list entries
  $('.list').fadeIn(1000);
  // Removing any existing pagination buttons
  $('.next').remove();
  $('.prev').remove();
  // Adding pagination buttons only if needed. Adding a type class for identifying which category the click event uses to populate the list when clicked
  if(data.length - end > 1) {
    $('.modalFooter').append('<p class="paginate next ' + type + '">Next</p>');
  }
  if(start > 0) {
    $('.modalFooter').append('<p class="paginate prev ' + type + '">Previous</p>');
  }
  // Setting the deedCounter to the last index position, only if the modal is open
  if($('.overlay').css('visibility') === 'visible') {
    deedCounter = end;
  }
};

// Populating the lists for new post modal
var modalLists = function(data, type) {
  // Assigning the global variables with the deeds for use while modal is open
  deeds = data;
  // Resetting the counter if navigating from email link
  if(gon.queue === true) {
    deedCounter = 0;
  }
  // Populating the list with the deeds based on the current active tab
  if(type === 'donation') {
    populate(deeds[0], deedCounter, deedCounter + 8, 'd');
  } else if(type === 'service') {
    populate(deeds[1], deedCounter, deedCounter + 8, 's');
  } else {
    populate(deeds[2], deedCounter, deedCounter + 8, 's');
  }
  // Emptying all the lists
  emptyPage();
  // Refreshing all the index page lists
  featuredLists(deeds);
  suggestedList(deeds);
};

// Function to add an individual entry into the featured list
var addFeaturedToList = function(data, list) {
  // Creating a new list item by creating a data object and passing it into the featured_entry jst template
  var template = JST['templates/featured_cause']({data: data});
  // Appending the template to the appropriate featured list
  $(list).append(template);
};

// Function to set up the featured deeds
var featuredLists = function(data) {
  // Sorting all the deed based on popularity
  var sortedDonation = sortVotes(data[0])[0];
  var sortedService = sortVotes(data[1])[0];
  var sortedLocal = sortVotes(data[2])[0];
  // Emptying old featured when refreshing
  $('.featuredLocal').empty();
  // Adding the featured deeds to the list
  addFeaturedToList(sortedLocal, '.featuredLocal');
  addFeaturedToList(sortedDonation, '.featuredLocal');
  addFeaturedToList(sortedService, '.featuredLocal');
  // Hiding the deeds initially
  $('.featuredLocal').children().fadeOut(0);
  // Displaying the first featured deed
  var showFeatured = $('.featuredLocal li:nth-child(1)');
  showFeatured.fadeIn(0);
  showFeatured.addClass('activeFeatured');
  // Setting the featured cycle interval
  cycledFeatured;
};

// Function to update the current featured
var showActiveFeature = function() {
  // Getting the current featured
  var current = $('.activeFeatured');
  // Fading out the current featured, then fading in the new featured item
  current.fadeOut(500, function() {
    var showFeatured = $('.featuredLocal li:nth-child(' + featuredIndex + ')');
    showFeatured.fadeIn(700);
    // Setting the new featured to active, and removing active on the old featured
    showFeatured.addClass('activeFeatured');
    current.removeClass('activeFeatured');
  });
  // Adjustig the featuredIndex
  if(featuredIndex === 3) {
    featuredIndex = 1
  } else {
    featuredIndex += 1;
  }
};

// Setting the interval for displaying the next current featured
var cycledFeatured = setInterval(showActiveFeature, 8000);

// Function to populate the suggested list
var suggestedList = function(data) {
  // Combining the deeds to one list
  var deeds = data[0].concat(data[1]).concat(data[2]);

  // Randomly setting the 5 displayed suggested deeds
  if(deedIndex === 0) {
    deedIndex = Math.floor(Math.random() * (deeds.length - 6));
  }
  _.each(deeds.slice(deedIndex, deedIndex + 5), function(d) {
    addDeedToList(d, '.suggestedDeeds');
  });
};

// Vote refresh function
var refreshVoteTotals = function(category) {
  if(deeds.length > 0) {
    // Resetting the deeds list to an empty array
    deeds = [];
    // Setting the deed counter so the current pages deeds will be displayed on refresh
    if(deedCounter > 0) {
      deedCounter = deedCounter - 8;
    }
    // Refreshing the deeds list with the new vote calculated as well as the current page the user is on
    populatePage(modalLists, category);
  }
};

// Get a deed's info function
var getDeed = function(id, status) {
  $.ajax('/deeds/' + id, {
    data: {
      ajax: 'This is an ajax call'
    }
  }).done(function(data) {
    // Shrinking the modal size for the details display
    modalSize(0.5);
    // Showing deed details
    if(status === 'current') {
      var template = JST['templates/deed_details']({details: data, status: 'current'});
    } else {
      var template = JST['templates/deed_details']({details: data, status: 'suggested'});
    }
    $('.window').append(template);
    showModal();
  });
};

