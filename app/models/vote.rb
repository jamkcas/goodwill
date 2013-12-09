class Vote < ActiveRecord::Base
  attr_accessible :votable_id, :type, :user_id

  belongs_to :user
  belongs_to :votable

  validates :user_id, presence: true
  validates :votable_id, presence: true
  validates :type, presence: true
end
