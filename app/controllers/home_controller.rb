class HomeController < ApplicationController

  skip_before_filter :authenticate_user!

  def index
  	
  end
  
  def thank_you  	
  end

  def user_details
  	loggedin_user = User.find_by_authentication_token(params[:authentication_token])
 	  render :json => {
      :current_user => loggedin_user, :responseMessage => GlobalMessage::LOGGED_SUCCESSFULLY,
    }
  end

  def tell_your_friends
    @authentication_token = params[:token]
  end

  def current_user_details
    current_user = User.where(authentication_token: params[:authentication_token]).first

    if current_user.unconfirmed_email.present? || current_user.unconfirmed_email == true
      unconfirmed_email_value = true
      response_message = GlobalMessage::SIGNING_UP_INVITE_FRIENDS
    else
      unconfirmed_email_value = false
      response_message = GlobalMessage::SIGNING_UP_CONFIRM_EMAIL
    end

    @user = { :id => current_user.id, :first_name => current_user.first_name, :last_name => current_user.last_name, :email => current_user.email, 
      :confirmed_at => current_user.confirmed_at, :unconfirmed_email => unconfirmed_email_value, :first_sign_in => current_user.first_sign_in,
      :second_sign_in => current_user.second_sign_in, :ui_language => current_user.ui_language, :original_language => current_user.original_language,
      :target_language => current_user.target_language, :level => current_user.level, :provider => current_user.provider, :sign_in_count => current_user.sign_in_count
    }#.to_json
    render :json => {
      :current_user => @user, :response_code => "200", :response_message => response_message,
    }
  end

  def user_details
  	loggedin_user = User.find_by_authentication_token(params[:authentication_token])
 	  render :json => {
      :current_user => loggedin_user, :responseMessage => GlobalMessage::LOGGED_SUCCESSFULLY,
    }
  end

  def register
    begin
      check_existing_user = User.find_by_email(params[:email])
      if check_existing_user.present?
        current_user = false
        response_code = "200"
        response_message = "User already exist. Please try another email."
      else
        @user = User.new
        @user.first_name = params[:first_name]
        @user.last_name = params[:last_name]
        @user.email = params[:email]
        @user.password = params[:password]
        @user.password_confirmation = params[:password_confirmation]
        @user.authentication_token = generate_authentication_token
        if @user.save
          current_user = @user 
          response_code = "200"
          response_message = GlobalMessage::SIGNING_UP_CONFIRM_EMAIL
        end
      end
    rescue ActiveRecord::RecordNotUnique
      current_user = false 
      response_code = "400"
      response_message = "User already exist. Please try another email."
    end
    render :json => {
      :current_user => current_user, :response_code => response_code, :response_message => response_message,
    }
  end

end
