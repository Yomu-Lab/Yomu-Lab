class ApplicationMailer < ActionMailer::Base

	default from: 'support@yomulab.com '
	#default from: 'yomulab@gmail.com '
  layout 'mailer'

	def error_occured_and_send_email_to_support_team(user, error)
		staff_email = "support@yomulab.com "
		@user = user
		@subject = "YomuLabs - Error Occured"
		#@url = 'https://yomu-lab-staging.herokuapp.com/'
		@url = 'https://yomu-lab-production.herokuapp.com/'
		mail( to: staff_email, subject: @subject )
	end

end
