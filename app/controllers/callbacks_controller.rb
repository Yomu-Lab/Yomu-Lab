class CallbacksController < Devise::OmniauthCallbacksController
  
  def facebook
    @user = User.from_omniauth(request.env["omniauth.auth"])
    @user.authentication_token = generate_authentication_token
    @user.save
    puts "=============#{check_user_existing(request.env["omniauth.auth"])}================"
    UserMailer.welcome_email(@user).deliver_later if check_user_existing(request.env["omniauth.auth"])
    redirect_to controller: 'home', action: 'tell_your_friends', token: "#{@user.authentication_token}"
  end

  def google_oauth2
    @user = User.from_omniauth(request.env["omniauth.auth"])
    @user.authentication_token = generate_authentication_token
    @user.save
    puts "=============#{check_user_existing(request.env["omniauth.auth"])}================"
    UserMailer.welcome_email(@user).deliver_later if check_user_existing(request.env["omniauth.auth"])
    redirect_to controller: 'home', action: 'tell_your_friends', token: "#{@user.authentication_token}"
  end


  def check_user_existing(auth)
    user_exist = false
    email_address = auth.info.email if auth.provider == "facebook"
    email_address = auth.extra.raw_info.email if auth.provider == "google_oauth2"

    check_user_exist = User.find_by_email(email_address)
    user_exist = true if check_user_exist
    return user_exist    
  end

end