class StockAdjustmentsController < ApplicationController
  before_action :authenticate_user!
  # Tambahkan update dan create jika perlu proteksi variabel
  before_action :set_stock_adjustment, only: %i[show update destroy]

  def index
    adjustments = StockAdjustment.includes(:product, :warehouse).order(created_at: :desc)
    products = Product.order(:name)
    warehouses = Warehouse.order(:name)
    
    render inertia: 'StockAdjustments/Index', props: { 
      adjustments: adjustments.as_json(include: %i[product warehouse]),
      products: products,
      warehouses: warehouses
    }
  end

  def create
    @adjustment = StockAdjustment.new(stock_adjustment_params)
    if @adjustment.save
      # Inertia akan otomatis mereload props index setelah redirect
      redirect_to stock_adjustments_path, notice: 'Stok berhasil dicatat'
    else
      redirect_to stock_adjustments_path, alert: 'Gagal mencatat stok', inertia: { errors: @adjustment.errors }
    end
  end

  def show
    render inertia: 'StockAdjustments/Show', props: {
      adjustment: @stock_adjustment.as_json(include: %i[product warehouse])
    }
  end

  def update
    if @stock_adjustment.update(stock_adjustment_params) # Diubah dari purchase_params
      redirect_to stock_adjustments_path, notice: 'Stok berhasil diperbarui'
    else
      redirect_to stock_adjustments_path, alert: 'Gagal memperbarui data'
    end
  end

  def destroy
    if @stock_adjustment.destroy
      redirect_to stock_adjustments_path, notice: 'Stok berhasil dihapus'
    else
      redirect_to stock_adjustments_path, alert: 'Gagal menghapus data'
    end
  end

  private

  def set_stock_adjustment
    @stock_adjustment = StockAdjustment.find(params[:id])
  end

  def stock_adjustment_params
    params.require(:stock_adjustment).permit(:product_id, :warehouse_id, :adjustment_type, :quantity, :reason, :note)
  end
end