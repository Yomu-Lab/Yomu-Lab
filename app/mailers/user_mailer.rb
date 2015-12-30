class UserMailer < ApplicationMailer

	default from: 'notifications@yomulabs.com'

	def welcome_email(user)
		@user = user
		@subject = "YomuLabs - Welcome You."
		@url = 'https://yomu-lab-staging.herokuapp.com/'
		mail(to: @user.email, subject: @subject )
	end

	def confirmation_link_to_unregistered_user(user)
		@user = user
		@subject = "YomuLabs - Confirmation Mail - To Verify Email Address."
		@url = 'https://yomu-lab-staging.herokuapp.com/'
		@confirmation_url = ""
		mail( to: @user.email, subject: @subject )
	end

	def reset_password_link(user)
		@user = user
		@subject = "YomuLabs - Reset Password Link  - To set new password."
		@url = 'https://yomu-lab-staging.herokuapp.com/'
		@reset_password_url = "https://yomu-lab-staging.herokuapp.com/ResetPassword/?token=<%=#{@user.token} %>">
		mail( to: @user.email, subject: @subject )
	end

end
