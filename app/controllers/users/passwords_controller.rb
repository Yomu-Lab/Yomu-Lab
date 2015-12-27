class Users::PasswordsController < Devise::PasswordsController
  # GET /resource/password/new
  # def new
  #   super
  # end

  # => POST /resource/password
  def create
    begin
      @user = User.find_by_email(resource_params[:email])
      if @user.present?
        @user.send_reset_password_instructions
        render :json => {
          :status => 200, :response_message => "Password reset successfully.",
        }
      else
        render :json => {
          :status => 400, :response_message => "No such email exists.",
        }
      end
    rescue
      # => Email To Support Team about Error occurence
      render :json => {
        :status => 400, :response_message => "Error occurred while reseting the password.",
      }
    end
  end

  # GET /resource/password/edit?reset_password_token=abcdef
  # def edit
  #   super
  # end

  # PUT /resource/password
  def update
    super
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
