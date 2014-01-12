module GoodwillHelper
  def checkUser
    # Setting status of the current user
    gon.logged_in = true if current_user
    gon.watch.loc = current_user.location if current_user
    gon.watch.new_user = current_user.new_user if current_user
  end

  def checkQueue
    # Setting status of the queue
    gon.watch.queue = session[:queue] == nil ? false : true
  end
end
