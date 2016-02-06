class AnnotationCategory < ActiveRecord::Base

	scope :active, -> { where status: true }
	scope :unique_name, -> { select("id, name") }

end
