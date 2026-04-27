class CreateSales < ActiveRecord::Migration[8.1]
  def change
    create_table :sales do |t|
      t.decimal :total_price, precision: 12, scale: 2

      t.timestamps
    end
  end
end
