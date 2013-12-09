class Favorite < ActiveRecord::Base
  attr_accessible :deed_id, :user_id

  belongs_to :user
  belongs_to :deed

  validates :user_id, presence: true
  validates :deed_id, presence: true
end
