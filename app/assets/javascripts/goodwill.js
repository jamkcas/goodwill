// Start of Javascript when page loads
$(function() {
  // Populating all the lists with deeds from the db
  populatePage(); // In deeds.js
  // Setting the current project if one exists
  getCurrent(); // In posts.js
});