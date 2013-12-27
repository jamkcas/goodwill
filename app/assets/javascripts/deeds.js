

var fullList = function(data, type) {
  var suggested = _.where(data, {category: 'suggested'});
  var suggestedDonations = _.where(suggested, {type: 'donation'});
  var suggestedServices = _.where(suggested, {type: 'service'});
  var local = _.where(data, {category: 'local'});
  if(type === 'donation') {
    var list = suggestedDonations;
  } else if(type = 'service') {
    var list = suggestedServices;
  } else {
    var list = local;
  }
  var template = JST['templates/deeds_list']({list: list, type: type});
  $('#overlayWindow').append(template);
  showModal();
};

// Populating the lists for the index page
var pageLists = function(data) {
  var suggested = _.where(data, {category: 'suggested'});
  var suggestedDonations = _.where(suggested, {type: 'donation'});
  var suggestedServices = _.where(suggested, {type: 'service'});

  var local = _.where(data, {category: 'local'});
  // Populating each list with the deed list returned from the db
  // if the deed category is suggested then it populates the suggested lists

  // if the deed type is a donation then it populates the donations list
  _.each(suggestedDonations.slice(0, 4), function(d) {
    addDeedToList(d, '#suggestedDonations');
  });
  // assignMore(suggestedDonations, 'donation');

  // if there are more suggested donations a more button is added
  if(suggestedDonations.length > 4) {
    $('#suggestedDonations').append('<p class="more moreDonations">More...</p>');
  }

  // if the deed type is a service then it populates the services list
  _.each(suggestedServices.slice(0, 4), function(d) {
      addDeedToList(d, '#suggestedServices');
  });
  // if there are more suggested services a more button is added
  if(suggestedServices.length > 4) {
    $('#suggestedServices').append('<p class="more moreServices">More...</p>');
  }

  // if the deed category is local it populates the local lists
  _.each(local.slice(0, 4), function(d) {
    addDeedToList(d, '#localCauses');
  });
  // if there are more local causes a more button is added
  if(local.length > 4) {
    $('#localCauses').append('<p class="more moreLocal">More...</p>');
  }
};


// // Sort votes function
// var sortVotes = function(data) {
//   var sort = _.sortBy(data, function(d) {
//     return -d.score;
//   });
//   return sort;
// };

// // Categorizing function
// var categorize = function(data, category) {
//   // Creating a new array to store only the categry type deeds
//   var sorted = [];
//   // Cycle through each deed and add the category type ones to the featured array
//   _.each(data, function(d) {
//     if(d.deed.category === category) {
//       sorted.push(d);
//     }
//   });
//   return sorted;
// };

// // Populating the featured deeds list
// var featuredLists = function(data) {
//   // Filtering out the suggested deeds
//   var featured = categorize(data, 'suggested');
//   // Sort the featured array by score
//   var sorted = sortVotes(featured);
//   // Displaying the top 6 scored deeds
//   _.each(sorted.slice(0, 6), function(d) {
//     var template = JST['templates/featured_entry']({data: d});
//     $('#featuredDeeds').append(template);
//   });
// };

// // Populating the featured local cause
// var featuredLocal = function(data) {
//   // Filtering out the local deeds
//   var featured = categorize(data, 'local');
//   // Getting the highest rated deed
//   var max = _.max(featured, function(entry) {
//     return entry.score;
//   });
//   // Displaying the highest rated deed
//   var template = JST['templates/featured_cause']({data: max});
//   $('#featuredLocal').append(template);
// };



// Clearing the lists (this is for when the votes are made in the modal view, to refresh the index page vote counts)
// var emptyPage = function() {
//   $('#suggestedDonations').empty();
//   $('#suggestedServices').empty();
//   $('#localCauses').empty();
// }

// var refreshLists = function() {
//   populatePage(pageLists);
//   populatePage(featuredLists);
//   populatePage(featuredLocal);
// };

// var assignDeedClicks = function() {

// };


