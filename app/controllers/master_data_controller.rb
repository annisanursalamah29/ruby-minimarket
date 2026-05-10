class MasterDataController < ApplicationController
  before_action :authenticate_user!

  def suppliers
    suppliers = Supplier.order(:name)
    render inertia: 'MasterData/Suppliers', props: { suppliers: suppliers }
  end

  def customers
    customers = Customer.order(:name)
    render inertia: 'MasterData/Customers', props: { customers: customers }
  end

  def warehouses
    warehouses = Warehouse.order(:name)
    render inertia: 'MasterData/Warehouses', props: { warehouses: warehouses }
  end

  def categories
    categories = Category.order(:name)
    render inertia: 'MasterData/Categories', props: { categories: categories }
  end
end