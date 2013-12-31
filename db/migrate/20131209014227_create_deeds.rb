class CreateDeeds < ActiveRecord::Migration
  def change
    create_table :deeds do |t|
      t.string :category
      t.string :deed_type
      t.string :title
      t.text :description
      t.string :deadline
      t.string :location
      t.string :email
      t.string :phone
      t.string :url
      t.string :picture
      t.integer :user_id

      t.timestamps
    end
  end
end
