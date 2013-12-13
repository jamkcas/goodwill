class Contact < ActiveRecord::Base
  attr_accessible :email, :name, :user_id

  belongs_to :User

  validates :email, presence: true
  validates :name, presence: true, uniqueness: true
  validates :user_id, presence: true
end
