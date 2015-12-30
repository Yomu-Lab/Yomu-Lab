class ApplicationMailer < ActionMailer::Base

	include Devise::Mailers::Helpers


	def reset_password_instructions(record, opts={})
		mail(:to => record, :subject => "Reset Password Instructions")
	end	


  default from: "from@example.com"
  layout 'mailer'


	def error_occured_and_send_email_to_support_team(user, error)
		staff_email = "yomulab@gmail.com"
		@user = user
		@subject = "YomuLabs - Error Occured"
		@url = 'https://yomu-lab-staging.herokuapp.com/'
		mail( to: staff_email, subject: @subject )
	end

end
