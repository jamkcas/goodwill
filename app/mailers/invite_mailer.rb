class InviteMailer < ActionMailer::Base
  default from: 'goodwilltracking@gmail.com'

  def invite(user, thread)
    @user = user
    @thread = thread
    mail(to: @user, subject: 'Do something kind today.')
  end
end
