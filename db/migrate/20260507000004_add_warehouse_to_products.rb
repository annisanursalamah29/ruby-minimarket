class AddWarehouseToProducts < ActiveRecord::Migration[8.1]
  def change
    add_reference :products, :warehouse, foreign_key: true, null: true
  end
end
