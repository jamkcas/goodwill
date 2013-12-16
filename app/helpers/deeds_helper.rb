module DeedsHelper
  def fetch_deeds
    # Getting all the deeds
    deeds = Deed.all()
    # Creating a new array to store new deeds hashes
    new_deeds = []
    # Cycling through each deed entry to create a new hash to store the deed itself, along with the number of up and down votes, and the current user's vote status for each deed
    deeds.each do |d|
      # Starting new hash to store deed and vote details together
      new_deed = {}
      # Adding the deed details
      new_deed[:deed] = d
      # Initializing the user's vote status to true as well as the vote counts to 0 for this deed
      new_deed[:voted] = false
      up = 0
      down = 0
      # Cycling through each vote for this deed and updating the count totals, as well as updating the user's vote status if they have voted for this deed already
      d.votes.each do |v|
        new_deed[:voted] = v.user_id == current_user.id ? true : false
        up += 1 if v.vote_type == true
        down += 1 if v.vote_type == false
      end
      # Setting the up and down vote totals for this deed
      new_deed[:up] = up
      new_deed[:down] = down
      # Setting the total score
      new_deed[:score] = up - down
      # Shoving the new deed into the new deeds has
      new_deeds << new_deed
    end
    # Returning the new_deeds hash
    new_deeds
  end
end