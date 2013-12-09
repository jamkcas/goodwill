class GoodwillController < ApplicationController
  def index
    @deeds = Deed.all()

    respond_to do |format|
      format.html
      format.json { render json: @deeds }
    end
  end
end
