module VotesHelper
  def input_vote
    id = params[:id].to_i
    # Converting the vote_type to a boolean
    vote_type = params[:vote_type] == 'up' ? 'up' : 'down'
    votable_type = params[:votable_type]
    # Saving the vote
    vote = Vote.create(user_id: current_user.id, votable_id: id, votable_type: votable_type, vote_type: vote_type)
    p ('*') * 50
    p vote
  end
end