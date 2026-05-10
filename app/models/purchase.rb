class Purchase < ApplicationRecord
  belongs_to :supplier
  belongs_to :warehouse, optional: true
  has_many :purchase_items, dependent: :destroy
  
  # Izinkan penyimpanan item sekaligus saat membuat purchase
  accepts_nested_attributes_for :purchase_items, allow_destroy: true

  enum :status, { draft: 0, ordered: 1, received: 2, cancelled: 3 }

  # Validasi Dasar
  validates :supplier, presence: true
  validates :order_date, presence: true
  validates :total_price, numericality: { greater_than_or_equal_to: 0 }

  # Penanganan Duplikat Nomor Dokumen (Permintaan Anda)
  # Uniqueness validation akan mengirimkan error ke controller untuk diproses Inertia
  validates :document_number, 
            presence: true, 
            uniqueness: { case_sensitive: false, message: "sudah digunakan, silakan masukkan nomor lain" }

  # Callback untuk memastikan total harga selalu sinkron sebelum disimpan
  before_validation :calculate_total_price

private

def calculate_total_price
  # Jangan hitung ulang jika objek sedang dihapus
  return if destroyed? || frozen?
  
  self.total_price = purchase_items.reject(&:marked_for_destruction?)
                                   .sum { |item| (item.quantity || 0) * (item.price || 0) }
end
end