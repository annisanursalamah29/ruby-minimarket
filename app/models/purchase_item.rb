class PurchaseItem < ApplicationRecord
  belongs_to :purchase
  belongs_to :product

  validates :quantity, presence: true, numericality: { greater_than: 0 }
  validates :price, presence: true, numericality: { greater_than_or_equal_to: 0 }

  # Callback untuk memicu update total_price di model Purchase
  # setiap kali ada item yang ditambah, diubah, atau dihapus
  after_commit :update_purchase_total

private

def update_purchase_total
  # Tambahkan pengecekan: Jangan save jika purchase sudah hancur atau sedang dihancurkan
  return if purchase.nil? || purchase.destroyed? || purchase.frozen?
  
  purchase.save
end
end