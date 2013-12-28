class VotesController < ApplicationController
  def save_vote
    # Saving the vote
    Vote.input_vote(params, current_user)

    # Returning the vote to use for updating the screen
    response = (params[:vote_type] == 'up' ? 1 : -1)

    render text: response
  end
end