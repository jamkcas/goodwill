class Vote < ActiveRecord::Base
  attr_accessible :deed_id, :type, :user_id
end
