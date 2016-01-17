class CreateReferralUsers < ActiveRecord::Migration
  def change
    create_table :referral_users do |t|
      t.integer :user_id
      t.integer :referral_user_id
      t.boolean :status	#, default: "true"

      t.timestamps null: false
    end
  end
end
