require 'spec_helper'

describe Comment do
  # Relationship tests
  it {should belong_to :user}
  it {should belong_to :commentable}
  it {should have_many :comments}

  # Validation tests
  it {should validate_presence_of(:user_id)}
  it {should validate_presence_of(:commentable_id)}
  it {should validate_presence_of(:commentable_type)}
  it {should validate_presence_of(:content)}
end
