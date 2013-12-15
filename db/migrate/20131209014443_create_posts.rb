class CreatePosts < ActiveRecord::Migration
  def change
    create_table :posts do |t|
      t.string :title
      t.text :content
      t.string :picture
      t.string :thread_id
      t.boolean :complete, default: false
      t.integer :user_id
      t.integer :deed_id
      t.float :lat
      t.float :lon

      t.timestamps
    end
  end
end
