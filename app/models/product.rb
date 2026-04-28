class Product < ApplicationRecord
  belongs_to :category, optional: true
  
  # Tambahkan baris ini:
  has_many :sale_items, dependent: :destroy

  validates :barcode, presence: true, uniqueness: { message: "sudah terdaftar di sistem" }
  validates :name, presence: true
end