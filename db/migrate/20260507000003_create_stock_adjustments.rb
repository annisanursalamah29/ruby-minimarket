class CreateStockAdjustments < ActiveRecord::Migration[8.1]
  def change
    create_table :stock_adjustments do |t|
      t.references :product, null: false, foreign_key: true
      t.references :warehouse, foreign_key: true
      t.integer :adjustment_type, null: false, default: 0
      t.integer :quantity, null: false, default: 0
      t.string :reason, null: false
      t.text :note

      t.timestamps
    end
  end
end
