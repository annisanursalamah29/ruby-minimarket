class CreatePurchasesAndPurchaseItems < ActiveRecord::Migration[8.1]
  def change
    create_table :purchases do |t|
      t.references :supplier, null: false, foreign_key: true
      t.references :warehouse, foreign_key: true
      t.string :document_number
      t.date :order_date, null: false
      t.date :received_at
      t.integer :status, null: false, default: 0
      t.decimal :total_price, precision: 12, scale: 2, null: false, default: 0
      t.text :notes

      t.timestamps
    end

    create_table :purchase_items do |t|
      t.references :purchase, null: false, foreign_key: true
      t.references :product, null: false, foreign_key: true
      t.integer :quantity, null: false, default: 1
      t.decimal :price, precision: 12, scale: 2, null: false, default: 0

      t.timestamps
    end
  end
end
