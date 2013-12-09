class Comment < ActiveRecord::Base
  attr_accessible :comment_id, :content, :deed_id, :post_id, :text, :user_id
end
