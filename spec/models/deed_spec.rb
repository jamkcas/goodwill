require 'spec_helper'

describe Deed do
  # Relationship tests
  it {should belong_to :user}
  it {should have_many :votes}
  it {should have_many :comments}
  it {should have_many :posts}
  it {should have_many :favorites}

  # Validation tests
  it {should validate_presence_of(:title)}
  it {should validate_presence_of(:deed_type)}
  it {should validate_presence_of(:description)}
  it {should validate_presence_of(:user_id)}
  it {should validate_presence_of(:location)}
  it {should validate_presence_of(:category)}
  it {should validate_presence_of(:contact)}
  it {should validate_presence_of(:contact_type)}
  it {should validate_presence_of(:deadline)}
end
