class Comment < ActiveRecord::Base
  attr_accessible :commentable_id, :content, :commentable_type, :user_id

  belongs_to :user
  belongs_to :commentable, polymorphic: true
  has_many :comments, as: :commentable

  validates :content, presence: true
  validates :user_id, presence: true
  validates :commentable_id, presence: true
  validates :commentable_type, presence: true
end
