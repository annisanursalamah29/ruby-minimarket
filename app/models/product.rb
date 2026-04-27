class Product < ApplicationRecord
  belongs_to :category, optional: true # Tambahkan 'optional: true' sementara

  # Memastikan barcode wajib diisi dan tidak boleh sama dengan barang lain
  validates :barcode, presence: true, uniqueness: { message: "sudah terdaftar di sistem" }
  validates :name, presence: true
end