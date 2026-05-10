class StockAdjustment < ApplicationRecord
  belongs_to :product
  belongs_to :warehouse, optional: true

  # Perbaikan baris 5:
  enum :adjustment_type, { addition: 0, removal: 1, correction: 2 }

  validates :quantity, presence: true, numericality: { other_than: 0 }
  validates :reason, presence: true
  validates :adjustment_type, presence: true

  after_create :apply_adjustment

  private

  def apply_adjustment
    return unless product

    # Menggunakan string agar sesuai dengan kembalian enum Rails
    delta = case adjustment_type
            when "addition"
              quantity
            when "removal"
              -quantity.abs # Memastikan quantity jadi negatif jika pengurahan
            else
              quantity
            end

    adjusted_stock = product.stock.to_i + delta
    product.update!(stock: adjusted_stock)
  end
end