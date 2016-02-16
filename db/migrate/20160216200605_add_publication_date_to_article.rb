class AddPublicationDateToArticle < ActiveRecord::Migration

	def self.up
    add_column :articles, :publication_date, :datetime
	end

	def self.down
		remove_column :articles, :publication_date
	end

end
