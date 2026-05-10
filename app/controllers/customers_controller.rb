class CustomersController < ApplicationController
  before_action :authenticate_user!
  before_action :set_customer, only: %i[update destroy]

  def index
    @customers = Customer.order(:name)
    render inertia: 'MasterData/Customers', props: { customers: @customers }
  end

  def create
    @customer = Customer.new(customer_params)
    if @customer.save
      redirect_to customers_path, notice: 'Pelanggan berhasil ditambahkan'
    else
      redirect_to customers_path, inertia: { errors: @customer.errors }
    end
  end

  def update
    if @customer.update(customer_params)
      redirect_to customers_path, notice: 'Pelanggan berhasil diperbarui'
    else
      redirect_to customers_path, inertia: { errors: @customer.errors }
    end
  end

  def destroy
    @customer.destroy
    redirect_to customers_path, notice: 'Pelanggan berhasil dihapus'
  end

  private

  def set_customer
    @customer = Customer.find(params[:id])
  end

  def customer_params
    params.require(:customer).permit(:name, :email, :phone, :address, :membership_number)
  end
end