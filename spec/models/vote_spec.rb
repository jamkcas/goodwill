require 'spec_helper'

describe Vote do
  # Relationship tests
  it {should belong_to :user}
  it {should belong_to :votable}

  # Validation tests
  it {should validate_presence_of(:user_id)}
  it {should validate_presence_of(:votable_id)}
  it {should validate_presence_of(:vote_type)}
end
