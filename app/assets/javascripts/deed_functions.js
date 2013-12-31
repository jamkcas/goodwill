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

// Function to attach the input file to the picture canvas
var readURL = function(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function(e) {
      // Setting the source of the picture canvas image
      $('.inputImage').attr('src', e.target.result);

      var width = $('.window').width();
      var height = $('.window').height();
      // Checking to see whether the window size should be determined by the image width or height
      if(Math.abs($('.inputImage').height() - height) > Math.abs($('.inputImage').width() - width)) {
        $('.inputImage').css('height', '100%');
      } else {
        $('.inputImage').css('width', '100%');
      }
    };

    reader.readAsDataURL(input.files[0]);
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
    $('.lists').append('<p class="paginate next ' + type + '">Next</p>');
  }
  if(start > 0) {
    $('.lists').append('<p class="paginate prev ' + type + '">Previous</p>');
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
    deedCounter = deedCounter - 8;
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

