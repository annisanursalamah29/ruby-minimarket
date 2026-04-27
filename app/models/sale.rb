class Sale < ApplicationRecord
  has_many :sale_items, dependent: :destroy
  accepts_nested_attributes_for :sale_items
end