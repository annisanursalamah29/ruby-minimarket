class Customer < ApplicationRecord
  has_many :sales

  # Membersihkan spasi di awal/akhir secara otomatis
  before_validation :normalize_inputs

  validates :name, presence: true
  validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }, allow_blank: true
  
  # Validasi unik untuk membership_number
  validates :membership_number, 
            uniqueness: { message: "Nomor membership sudah terdaftar!" }, 
            allow_blank: true

  private

  def normalize_inputs
    self.membership_number = membership_number.strip if membership_number.present?
    self.name = name.strip if name.present?
  end
end