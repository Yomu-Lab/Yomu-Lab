class UserMailer < ApplicationMailer

	default from: 'support@yomulab.com'
	#default from: 'yomulab@gmail.com'

	def welcome_email(user, server_type)
		@user = user
		@subject = "Confirmation instructions"
		@server_type = server_type
		@token = user.confirmation_token
		mail(to: @user.email, subject: @subject )
	end

	# def confirmation_link_to_unregistered_user(user)
	# 	@user = user
	# 	@subject = "YomuLabs - Confirmation Mail - To Verify Email Address."
	# 	@url = 'https://yomu-lab-staging.herokuapp.com/'
	# 	#@confirmation_url = ""
	# 	mail( to: @user.email, subject: @subject )
	# end

	def reset_password_link(user)
		@user = user
		@subject = "YomuLabs - Reset Password Link"
		#@url = 'https://yomu-lab-staging.herokuapp.com/'
		@url = 'https://yomu-lab-production.herokuapp.com/'
		#@reset_password_url = "https://yomu-lab-staging.herokuapp.com/ResetPassword/?token=<%=#{@user.token} %>">
		@reset_password_url = "https://yomu-lab-production.herokuapp.com/ResetPassword/?token=<%=#{@user.token} %>">
		mail( to: @user.email, subject: @subject )
	end

end
