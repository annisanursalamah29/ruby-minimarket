class SuppliersController < ApplicationController
  before_action :authenticate_user!
  before_action :set_supplier, only: %i[update destroy]

  def index
    suppliers = Supplier.order(created_at: :desc).all
    render inertia: 'MasterData/Suppliers', props: { suppliers: suppliers }
  end

  def create
    @supplier = Supplier.new(supplier_params)
    if @supplier.save
      # Redirect kembali ke index, Inertia akan mengirimkan data suppliers terbaru
      redirect_to suppliers_path, notice: 'Berhasil ditambah'
    else
      # Kirim error validasi kembali ke form
      redirect_to suppliers_path, alert: @supplier.errors.full_messages, inertia: { errors: @supplier.errors }
    end
  end

  def update
    if @supplier.update(supplier_params)
      redirect_to suppliers_path, notice: 'Berhasil diperbarui'
    else
      redirect_to suppliers_path, alert: @supplier.errors.full_messages, inertia: { errors: @supplier.errors }
    end
  end

  def destroy
    @supplier.destroy
    redirect_to suppliers_path, notice: 'Berhasil dihapus'
  end

  private

  def set_supplier
    @supplier = Supplier.find(params[:id])
  end

  def supplier_params
    params.require(:supplier).permit(
      :name, :email, :phone, :address, :contact_person, :terms)
  end
end