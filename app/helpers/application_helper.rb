module ApplicationHelper

	def check_environment url
    url = root_url if url.nil?
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

end
