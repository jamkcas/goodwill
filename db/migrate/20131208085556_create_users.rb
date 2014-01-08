class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :provider
      t.string :uid
      t.string :name
      t.string :oauth_token
      t.datetime :oauth_expires_at
      t.string :google_token
      t.string :profile_pic
      t.boolean :new_user, default: true
      t.string :location

      t.timestamps
    end
  end
end
