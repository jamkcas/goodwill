class DeedsController < ApplicationController
  def index
    @deeds = Deed.all()

    render json: @deeds
  end
end