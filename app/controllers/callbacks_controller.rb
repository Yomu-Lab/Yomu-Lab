class CallbacksController < Devise::OmniauthCallbacksController
  
  def facebook
    @user = User.from_omniauth(request.env["omniauth.auth"])
    @user.authentication_token = generate_authentication_token
    @user.save
    UserMailer.welcome_email(@user).deliver_later
    redirect_to controller: 'home', action: 'tell_your_friends', token: "#{@user.authentication_token}"
  end

  def google_oauth2
    @user = User.from_omniauth(request.env["omniauth.auth"])
    @user.authentication_token = generate_authentication_token
    @user.save
    UserMailer.welcome_email(@user).deliver_later
    redirect_to controller: 'home', action: 'tell_your_friends', token: "#{@user.authentication_token}"
  end

end