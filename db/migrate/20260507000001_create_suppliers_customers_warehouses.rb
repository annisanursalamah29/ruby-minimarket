class CreateSuppliersCustomersWarehouses < ActiveRecord::Migration[8.1]
  def change
    create_table :suppliers do |t|
      t.string :name, null: false
      t.string :email
      t.string :phone
      t.string :contact_person
      t.text :address
      t.text :terms

      t.timestamps
    end

    create_table :customers do |t|
      t.string :name, null: false
      t.string :email
      t.string :phone
      t.string :address
      t.string :membership_number

      t.timestamps
    end

    create_table :warehouses do |t|
      t.string :name, null: false
      t.string :location
      t.text :description

      t.timestamps
    end
  end
end
