class PurchasesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_purchase, only: %i[show update destroy]

  def index
    purchases = Purchase.includes(:supplier, :warehouse, purchase_items: :product).order(created_at: :desc)
    
    render inertia: 'Purchases/Index', props: { 
      purchases: purchases.as_json(include: { 
        supplier: {}, 
        warehouse: {}, 
        purchase_items: { include: :product } 
      }),
      suppliers: Supplier.order(:name),
      warehouses: Warehouse.order(:name),
      products: Product.order(:name)
    }
  end

  def create
    @purchase = Purchase.new(purchase_params)
    if @purchase.save
      redirect_to purchases_path, notice: 'Pembelian berhasil dicatat'
    else
      # Konsisten dengan CustomersController: mengirim kembali errors
      redirect_to purchases_path, inertia: { errors: @purchase.errors }
    end
  end

  def show
    render inertia: 'Purchases/Show', props: {
      purchase: @purchase.as_json(
        include: { 
          supplier: { only: [:id, :name, :email] }, 
          warehouse: { only: [:id, :name, :location] }, 
          purchase_items: { 
            include: { product: { only: [:id, :name, :barcode] } } 
          } 
        }
      )
    }
  end

  def update
    if @purchase.update(purchase_params)
      redirect_to purchases_path, notice: 'Pembelian berhasil diperbarui'
    else
      redirect_to purchases_path, inertia: { errors: @purchase.errors }
    end
  end
  
  def destroy
    if @purchase.destroy
      redirect_to purchases_path, notice: 'Pembelian berhasil dihapus'
    else
      redirect_to purchases_path, alert: 'Gagal menghapus data'
    end
  end

  private

  def set_purchase
    @purchase = Purchase.includes(:supplier, :warehouse, purchase_items: :product).find(params[:id])
  end

    # app/controllers/purchases_controller.rb
  def purchase_params
    params.require(:purchase).permit(
      :supplier_id, :warehouse_id, :order_date, :received_at, 
      :status, :total_price, :document_number, :notes,
      # PERBAIKAN: Harus dalam bentuk array [] agar item tersimpan
      purchase_items_attributes: [:id, :product_id, :quantity, :price]
    )
  end
end