class CallbacksController < Devise::OmniauthCallbacksController
  
  def facebook
    @user = User.from_omniauth(request.env["omniauth.auth"])
    @user.authentication_token = generate_authentication_token

    existing_user = check_user_existing(request.env["omniauth.auth"])
    @user.referral_code = generate_referral_token if existing_user.referral_code.blank?
    @user.password_manually_set = false if existing_user.password_manually_set.blank?
    @user.refresh_token = generate_refresh_token if existing_user.refresh_token.blank?
    @user.save

    UserMailer.welcome_email(@user).deliver_later if !existing_user.present?
    redirect_to controller: 'home', action: 'tell_your_friends', token: "#{@user.authentication_token}"
  end

  def google_oauth2
    @user = User.from_omniauth(request.env["omniauth.auth"])
    @user.authentication_token = generate_authentication_token

    existing_user = check_user_existing(request.env["omniauth.auth"])
    @user.referral_code = generate_referral_token if existing_user.referral_code.blank?
    @user.password_manually_set = false if existing_user.password_manually_set.blank?
    @user.refresh_token = generate_refresh_token if existing_user.refresh_token.blank?
    @user.save

    UserMailer.welcome_email(@user).deliver_later if !existing_user.present?
    redirect_to controller: 'home', action: 'tell_your_friends', token: "#{@user.authentication_token}"
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
    # user_exist = true if check_user_exist
    # return user_exist    
  end

end
