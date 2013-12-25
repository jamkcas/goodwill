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

// // Populating the lists for new post modal
// var modalLists = function(data) {
//   // Populating each list with the deed list returned from the db
//   _.each(data, function(d) {
//     // if the deed category is a deed then it populates the suggested lists
//     if(d.category === 'suggested') {
//       // if the deed type is a donation then it populates the donations list
//       if(d.deed.type === 'donation') {
//         addDeedToList(d, '.suggestedDonationsModal');
//       } else { // if the deed type is a service then it populates the services list
//         addDeedToList(d, '.suggestedServicesModal');
//       }
//     } else { // if the deed category is help it populates the local lists
//       addDeedToList(d, '.localCausesModal');
//     }
//   });
// };