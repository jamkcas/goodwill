class GoodwillController < ApplicationController
  def index

    if current_user
      post = Post.where(params[current_user.id]).where(complete: false)
    end

    respond_to do |format|
      format.html
      format.json
    end
  end
end
