require 'spec_helper'

describe User do
  # Relationships
  it {should have_many :deeds}
  it {should have_many :comments}
  it {should have_many :posts}
  it {should have_many :votes}
  it {should have_many :favorites}
end