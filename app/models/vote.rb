class Vote < ActiveRecord::Base
  attr_accessible :votable_id, :vote_type, :user_id, :votable_type

  belongs_to :user
  belongs_to :votable

  validates :user_id, presence: true
  validates :votable_id, presence: true
  validates :votable_type, presence: true

  #################################
  ##### Method to save a vote #####
  #################################

  def self.input_vote(params, current_user)
    id = params[:id].to_i
    # Converting the vote_type to a boolean
    vote_type = params[:vote_type] == 'up' ? 'up' : 'down'
    votable_type = params[:votable_type]
    # Saving the vote
    vote = Vote.create(user_id: current_user.id, votable_id: id, votable_type: votable_type, vote_type: vote_type)
  end
end
