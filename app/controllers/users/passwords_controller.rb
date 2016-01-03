class Users::PasswordsController < Devise::PasswordsController

  # GET /resource/password/new
  # def new
  #   super
  # end

  # => POST /resource/password
  def create
    begin
      @user = User.find_by_email(params[:user][:email])

      if @user.present?
        @user.send_reset_password_instructions
        UserMailer.reset_password_instructions(resource_params[:email]).deliver
        render :status => 200, :json => {:response_type => "success", :response_code => 200, :response_message => "An email will be sent to your Primary Email address that includes a password reset link."}
      else
        render :status => 200, :json => {:response_type => "error", :response_code => 400, :response_message => "No such email exists."}
      end
    rescue
      # => Email To Support Team about Error occurence
      render :status => 200, :json => {:response_type => "success", :response_code => 400, :response_message => "An email will be sent to your Primary Email address that includes a password reset link."}
    end
  end

  # GET /resource/password/edit?reset_password_token=abcdef
  # def edit
  #   super
  # end

  # PUT /resource/password
  def update
    reset_password_token = Devise.token_generator.digest(User, :reset_password_token, params[:user][:reset_password_token])
    @user_detail = User.find_by_reset_password_token(reset_password_token)
    user_data_save = @user_detail.update(user_params)

    if user_data_save
      render :status => 200, :json => {:status => "success", :response_code => 200, :response_message => "Password updated successfully. Please sign in again."}
    else
      render :status => 404, :json => {:status => "error", :response_code => 200, :response_message => "Invalid userid."}
    end
  end

  def user_params
    # NOTE: Using `strong_parameters` gem
    params.require(:user).permit(:reset_password_token, :password, :password_confirmation)
  end


  # protected

  # def after_resetting_password_path_for(resource)
  #   super(resource)
  # end

  # The path used after sending reset password instructions
  # def after_sending_reset_password_instructions_path_for(resource_name)
  #   super(resource_name)
  # end
end
