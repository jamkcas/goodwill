require 'spec_helper'

describe PostsController do
  before(:each) do
    @user = User.new
    @user[:provider] = 'facebook'
    @user[:uid] = '12345678'
    @user[:name] = 'John Doe'
    @user[:oauth_token] = 'blah'
    @user[:oauth_expires_at] = 'blah blah'
    @user.save
  end

  describe "POST 'create'" do
    it "should add a post to the db" do
      current_user = @user
      expect{ post :create, post: {title: 'new question', content: 'new answer', user_id: 1, deed_id: 1, thread_id: 1}}.to change(Post, :count).by(1)
    end

    it "should find the right user" do
      expect(@user.name).to eq('John Doe')
    end
  end

end