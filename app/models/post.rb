class Post < ActiveRecord::Base
  attr_accessible :complete, :content, :deed_id, :picture, :thread_id, :title, :user_id

  belongs_to :user
  belongs_to :deed
  has_many :comments, as: :commentable
  has_many :votes, as: :votable

  validates :complete, presence: true
  validates :content, presence: true
  validates :deed_id, presence: true
  validates :user_id, presence: true
  validates :title, presence: true
  validates :thread_id, presence: true
end
