class ApplicationController < ActionController::Base

  #helper :all
  helper ApplicationHelper

  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  #protect_from_forgery with: :exception
  protect_from_forgery with: :null_session

  #acts_as_token_authentication_handler_for User

  after_filter :set_csrf_cookie_for_ng

  def set_csrf_cookie_for_ng
    cookies['XSRF-TOKEN'] = form_authenticity_token if protect_against_forgery?
  end

  def generate_authentication_token
    return Devise.friendly_token
  end

  def generate_referral_token
    return SecureRandom.hex(4)
  end

  def generate_refresh_token
    require 'securerandom'
    return SecureRandom.uuid
  end

  def ensure_signup_complete
    # Ensure we don't go into an infinite loop
    return if action_name == 'finish_signup'

    # Redirect to the 'finish_signup' page if the user email hasn't been verified yet
    if current_user && !current_user.email_verified?
      redirect_to finish_signup_path(current_user)
    end
  end

  def check_environment
    url = request.host
    if url.include?('staging')
      return "staging"
    elsif url.include?('production')
      return "production"
    elsif url.include?('yomulab')
      return "yomulab"
    else
      return "localhost"
    end
  end

protected

  # In Rails 4.2 and above
  def verified_request?
    super || valid_authenticity_token?(session, request.headers['X-XSRF-TOKEN'])
  end
end
