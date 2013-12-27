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
  var template = JST['templates/deed_entry']({data: data});
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
  // Setting the deedCounter to the last index position
  deedCounter = end;
};

// Populating the lists for new post modal
var modalLists = function(data, type) {
  // Assigning the global variables with the deeds for use while modal is open
  deeds = data;

  // Populating the list with the deeds based on the current active tab
  if(type === 'donation') {
    populate(deeds[0], deedCounter, deedCounter + 8, 'd');
  } else if(type === 'service') {
    populate(deeds[1], deedCounter, deedCounter + 8, 's');
  } else {
    populate(deeds[2], deedCounter, deedCounter + 8, 's');
  }
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

