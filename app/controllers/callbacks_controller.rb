class CallbacksController < Devise::OmniauthCallbacksController
  
  def facebook
    authentication_token = ""
    existing_user = check_user_existing(request.env["omniauth.auth"])    
    if !existing_user.present?
      @user = User.from_omniauth(request.env["omniauth.auth"])
      @user.authentication_token = generate_authentication_token
      @user.referral_code = generate_referral_token
      @user.password_manually_set = false
      @user.refresh_token = generate_refresh_token
      @user.save
      authentication_token = @user.authentication_token
      server_type = check_environment

      # => Welcome Message      
      UserMailer.welcome_email(@user, server_type).deliver_later
    else
      authentication_token = existing_user.authentication_token
    end
    redirect_to controller: 'home', action: 'tell_your_friends', token: "#{authentication_token}"
  end

  def google_oauth2
    authentication_token = ""
    existing_user = check_user_existing(request.env["omniauth.auth"])

    if !existing_user.present?
      @user = User.from_omniauth(request.env["omniauth.auth"])
      @user.authentication_token = generate_authentication_token
      @user.referral_code = generate_referral_token
      @user.password_manually_set = false
      @user.refresh_token = generate_refresh_token
      @user.save
      authentication_token = @user.authentication_token
      server_type = check_environment

      # => Welcome Message      
      UserMailer.welcome_email(@user, server_type).deliver_later
    else
      authentication_token = existing_user.authentication_token
    end
    redirect_to controller: 'home', action: 'tell_your_friends', token: "#{authentication_token}"
  end


  def check_user_existing(auth)
    user_exist = false
    email_address = auth.info.email if auth.provider == "facebook"
    email_address = auth.extra.raw_info.email if auth.provider == "google_oauth2"

    check_user_exist = User.find_by_email(email_address)
    if check_user_exist.present?
      return check_user_exist
    else
      return false
    end
  end

end
