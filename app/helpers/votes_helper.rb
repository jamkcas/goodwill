module VotesHelper
  def input_vote
    id = params[:id].to_i
    vote_type = params[:vote_type] == 'true' ? true : false
    votable_type = params[:votable_type]
    vote = Vote.create(user_id: current_user.id, votable_id: id, votable_type: votable_type, vote_type: vote_type)
  end
end