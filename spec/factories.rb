require 'factory_girl'

FactoryGirl.define do
  factory :user do
    provider 'facebook'
    uid '12345678'
    name 'John Doe'
    oauth_token 'blah'
    oauth_expires_at 'blah blah'
  end
end