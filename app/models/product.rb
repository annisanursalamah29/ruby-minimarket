class Product < ApplicationRecord
  belongs_to :category, optional: true
  belongs_to :warehouse, optional: true
  has_many :sale_items, dependent: :destroy
  has_many :purchase_items, dependent: :destroy
  has_many :stock_adjustments, dependent: :restrict_with_exception

  validates :barcode, presence: true, uniqueness: { message: "sudah terdaftar di sistem" }
  validates :name, presence: true
end