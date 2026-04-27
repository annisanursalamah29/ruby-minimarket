class SaleItem < ApplicationRecord
  belongs_to :sale
  belongs_to :product

  # Logika otomatis potong stok setelah barang terjual
  after_create :reduce_product_stock

  private

  def reduce_product_stock
    product.update!(stock: product.stock - quantity)
  end
end