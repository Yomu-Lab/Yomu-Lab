class CreateArticles < ActiveRecord::Migration
  def change
    create_table :articles do |t|
      t.integer :user_id
      t.string :original_language
      t.string :level
      t.string :title
      t.text :body
      t.string :source_name
      t.string :source_url
      t.string :publication_status
      t.integer :word_count, default: 0, null: false
      t.integer :character_count, default: 0, null: false

      t.timestamps null: false
    end
  end
end
