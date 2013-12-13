module PostsHelper
  def query_current
    # Find the current post id
    current_post = current_user.posts.where(complete: false)[0].id
    # Find the deed associated with current post
    deed = Deed.find(current_post)
    # Starting a new hash to return
    current = {}
    # Passing in current posts id to the hash, and the details of the associated deed
    current[:id] = current_post
    current[:details] = deed
    # Return the current_post
    current
  end

  def start_post
    @post = Post.create(params[:post])
  end

  def send_invite
    friend = Contact.find(params[:friend])
    thread = params[:thread]
    # Send email passing in the user's current thread and the contact's email
    invite = InviteMailer.invite(friend, thread).deliver
  end
end