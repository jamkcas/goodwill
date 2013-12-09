require 'spec_helper'

describe Favorite do
  # Relationship tests
  it {should belong_to :user}
  it {should belong_to :deed}

  # Validation tests
  it {should validate_presence_of(:user_id)}
  it {should validate_presence_of(:deed_id)}
end
