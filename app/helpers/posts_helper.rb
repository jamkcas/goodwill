module PostsHelper
  def set_queue
    # Setting a session variable to temporarily save the thread id, while user is directed through login process
    unless Post.find_all_by_thread_id(params[:id]).empty?
      session[:queue] = params[:id]
    end
  end

  def clear_queue
    session[:queue] = nil
  end
end