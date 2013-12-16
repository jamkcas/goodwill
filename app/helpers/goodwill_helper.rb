module GoodwillHelper
  def checkUser
    # Setting status of the current user
    gon.logged_in = true if current_user
  end

  def checkQueue
    # Setting status of the queue
    gon.watch.queue = session[:queue] == nil ? false : true
  end
end
