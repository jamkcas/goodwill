class CreateDeeds < ActiveRecord::Migration
  def change
    create_table :deeds do |t|
      t.string :category
      t.string :deed_type
      t.string :title
      t.text :description
      t.string :deadline
      t.string :location
      t.string :contact
      t.string :contact_type
      t.string :picture
      t.integer :user_id

      t.timestamps
    end
  end
end
