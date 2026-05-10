class Warehouse < ApplicationRecord
  has_many :products
  has_many :purchases
  has_many :stock_adjustments

  validates :name, presence: true
end
