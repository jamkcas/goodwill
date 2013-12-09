class Post < ActiveRecord::Base
  attr_accessible :complete, :content, :deed_id, :picture, :thread_id, :title, :user_id
end
