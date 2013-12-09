class Deed < ActiveRecord::Base
  attr_accessible :category, :contact, :contact_type, :deadline, :description, :location, :picture, :title, :type, :user_id

  belongs_to :user
  has_many :posts
  has_many :comments
  has_many :votes
  has_many :favorites

  validates :category, presence: true
  validates :type, presence: true
  validates :title, presence: true
  validates :description, presence: true
  validates :user_id, presence: true
  validates :location, presence: true
  validates :contact, presence: true
  validates :contact_type, presence: true
  validates :deadline, presence: true

  # I want to try changing validations later since not every entry needs the same validations. The below validations break the rspec tests for the above validations tho

  # validates :user_id, presence: true, uniqueness: { scope: :event_status }, if: :event_status
  # validates :location, presence: true, if: :category == 'help'
  # validates :contact, presence: true, if: :category == 'help'
  # validates :contact_type, presence: true, if: :category == 'help'
  # validates :deadline, presence: true, if: :category == 'help'
end
