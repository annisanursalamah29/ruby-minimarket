class Supplier < ApplicationRecord
  has_many :purchases, dependent: :restrict_with_exception

  validates :name, presence: true
  validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }, allow_blank: true
end
