class CreateVotes < ActiveRecord::Migration
  def change
    create_table :votes do |t|
      t.integer :user_id
      t.integer :deed_id
      t.boolean :type

      t.timestamps
    end
  end
end
