class CallbacksController < Devise::OmniauthCallbacksController
  
  def facebook
    @user = User.from_omniauth(request.env["omniauth.auth"])
    @user.authentication_token = generate_authentication_token
    @user.save
    #sign_in_and_redirect @user
    # redirect_to home_tell_your_friends_path
    #redirect_to home_tell_your_friends_path, :notice => "User ............", :token => "Adfasdfasdfasdadsf"

    # => /thing/3/edit?something=else
    redirect_to controller: 'home', action: 'tell_your_friends', token: "#{@user.authentication_token}"
  end

  def google_oauth2
    @user = User.from_omniauth(request.env["omniauth.auth"])
    sign_in_and_redirect @user
  end

end