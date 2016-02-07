class CreateAnnotations < ActiveRecord::Migration
  def change
    create_table :annotations do |t|
      t.integer :user_id
      t.integer :article_id
      t.string :destination_language
      t.text :source_text
      t.integer :location_start
      t.integer :location_end
      t.integer :word_count
      t.integer :character_count
      t.integer :annotation_category_id
      t.string :original_conjugation
      t.string :definition
      t.string :reading
      t.text :translation
      t.text :usage_note
      t.text :specific_note
      t.integer :paragraph_id

      t.timestamps null: false
    end
  end
end
