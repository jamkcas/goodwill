require 'spec_helper'

describe Post do
  # Relationship tests
  it {should belong_to :user}
  it {should belong_to :deed}
  it {should have_many :comments}
  it {should have_many :votes}

  # Validation tests
  it {should validate_presence_of(:title)}
  it {should validate_presence_of(:deed_id)}
  it {should validate_presence_of(:thread_id)}
  it {should validate_presence_of(:user_id)}
  it {should validate_presence_of(:content)}
  it {should validate_presence_of(:complete)}
end
