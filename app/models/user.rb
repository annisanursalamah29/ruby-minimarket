class User < ApplicationRecord
  has_secure_password

  # enum role: { admin: 0, cashier: 1, warehouse: 2, accountant: 3 }

  validates :email, presence: true, uniqueness: true
  validates :role, presence: true
end



