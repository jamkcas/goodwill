class CreateComments < ActiveRecord::Migration
  def change
    create_table :comments do |t|
      t.integer :user_id
      t.integer :post_id
      t.integer :deed_id
      t.integer :comment_id
      t.string :content
      t.string :text

      t.timestamps
    end
  end
end
