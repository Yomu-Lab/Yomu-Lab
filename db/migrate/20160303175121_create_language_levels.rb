class CreateLanguageLevels < ActiveRecord::Migration
  def change
    create_table :language_levels do |t|
      t.integer :language_id
      t.string :level

      t.timestamps null: false
    end
  end
end
