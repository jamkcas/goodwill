class InviteMailer < ActionMailer::Base

  def invite(user, thread, name)
    address = Mail::Address.new 'goodwilltracking@gmail.com'
    address.display_name = name
    @user = user
    @thread = thread
    mail(to: @user, subject: 'Do something kind today.', from: address)
  end
end
