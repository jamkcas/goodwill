class VotesController < ApplicationController
  include VotesHelper

  def save_vote
    # Saving the vote
    input_vote

    # Returning the vote to use for updating the screen
    response = (params[:vote_type] == 'up' ? 1 : -1)
    p ('*') * 50
    p response
    render text: response
  end

  def get_votes

  end
end