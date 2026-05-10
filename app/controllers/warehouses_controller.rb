class WarehousesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_warehouse, only: %i[update destroy]

  def index
    # Ambil data gudang untuk ditampilkan di tabel
    @warehouses = Warehouse.order(:name)
    
    # Gunakan render inertia untuk merender halaman React
    render inertia: 'MasterData/Warehouses', props: {
      warehouses: @warehouses
    }
  end

  def create
    warehouse = Warehouse.new(warehouse_params)
    if warehouse.save
      # HARUS Redirect ke index agar Inertia mengupdate props secara otomatis
      redirect_to warehouses_path, notice: 'Gudang berhasil ditambahkan'
    else
      # Kirim error kembali ke form via session flash
      redirect_to warehouses_path, alert: warehouse.errors.full_messages
    end
  end

  def update
    if @warehouse.update(warehouse_params)
      # Redirect setelah sukses update
      redirect_to warehouses_path, notice: 'Gudang berhasil diperbarui'
    else
      redirect_to warehouses_path, alert: @warehouse.errors.full_messages
    end
  end

  def destroy
    @warehouse.destroy
    # Redirect setelah hapus
    redirect_to warehouses_path, notice: 'Gudang berhasil dihapus'
  end

  private

  def set_warehouse
    @warehouse = Warehouse.find(params[:id])
  end

  def warehouse_params
    # Pastikan parameter sesuai dengan 'warehouse: values' di React
    params.require(:warehouse).permit(:name, :location, :description)
  end
end