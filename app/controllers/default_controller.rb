class DefaultController < ApplicationController

	layout "default"

  def forgot_password 
  end

  def reset_password
  end

  def get_user_details_by_reset_password_token
  	params_token = params[:token]
		token = Devise.token_generator.digest(User, :reset_password_token, params_token)
		user = User.find_by_reset_password_token(token)
  	render :json => {
      :current_user => user, :response_code => 200,
    }
  end

end