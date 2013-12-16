class VotesController < ApplicationController
  include VotesHelper

  def save_vote
    # Saving the vote
    input_vote

    # Returning the vote to use for updating the screen
    response = (params[:vote_type] == 'true' ? 1 : -1)
    render text: response
  end

  def get_votes

  end
end