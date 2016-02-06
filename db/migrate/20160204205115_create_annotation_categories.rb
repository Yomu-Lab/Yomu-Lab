class CreateAnnotationCategories < ActiveRecord::Migration
  def change
    create_table :annotation_categories do |t|
      t.string :name
      t.boolean :status, default: true, null: false

      t.timestamps null: false
    end

    ["Vocabulary","Grammar","Translation","Culture","Other"].each do |category|
    	AnnotationCategory.create!(:name => category)
    end
  end
end
