class Vote < ActiveRecord::Base
  attr_accessible :votable_id, :vote_type, :user_id, :votable_type

  belongs_to :user
  belongs_to :votable

  validates :user_id, presence: true
  validates :votable_id, presence: true
  validates :votable_type, presence: true
end
