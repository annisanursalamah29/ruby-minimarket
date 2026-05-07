class SalesController < ApplicationController
  before_action :authenticate_user!
  # Sebaiknya jangan skip CSRF token jika sudah menggunakan Inertia, 
  # tapi jika untuk testing di lokal tidak apa-apa.
  skip_before_action :verify_authenticity_token

  def new
    # Eager loading category jika di tampilan kasir ada label kategori
    products = Product.includes(:category).where("stock > 0")
    render inertia: 'Sales/Cashier/CashierMain', props: { products: products }
  end

  def create
  ActiveRecord::Base.transaction do
    sale = Sale.create!(total_price: params[:total_price])
    
    params[:items].each do |item|
      sale_item = sale.sale_items.create!(
        product_id: item[:product_id],
        quantity: item[:quantity],
        price: item[:price]
      )
      
      # Broadcast stok menipis secara Real-Time
      product = sale_item.product
      if product.stock < 10
        ActionCable.server.broadcast(
          "inventory_channel", 
          { message: "Stok #{product.name} sisa #{product.stock}!", type: "warning" }
        )
      end
    end
  end
  redirect_to sales_new_path, notice: "Transaksi Berhasil!"
end

  def show
    @sale = Sale.includes(sale_items: :product).find(params[:id])
    render inertia: 'Sales/Receipt/ReceiptMain', props: { 
      sale: @sale.as_json(include: { sale_items: { include: :product } }) 
    }
  end

  def history
    month_filter = params[:month]
    
    # Eager loading untuk menghindari N+1 query yang berat di laporan
    query = Sale.includes(sale_items: :product).order(created_at: :desc)

    if month_filter.present?
      begin
        start_date = Date.parse("#{month_filter}-01")
        end_date = start_date.end_of_month
        query = query.where(created_at: start_date.beginning_of_day..end_date.end_of_day)
      rescue Date::Error
        # Jika format bulan salah, abaikan filter
      end
    end

    # Paginasi menggunakan Kaminari
    paginated_sales = query.page(params[:page]).per(10)

    render inertia: 'Sales/History/HistoryMain', props: {
      sales: {
        data: paginated_sales.as_json(include: { sale_items: { include: :product } }),
        current_page: paginated_sales.current_page,
        total_pages: paginated_sales.total_pages,
        total_count: paginated_sales.total_count,
        is_first_page: paginated_sales.first_page?,
        is_last_page: paginated_sales.last_page?,
        next_page: paginated_sales.next_page,
        prev_page: paginated_sales.prev_page
      },
      filters: { month: month_filter || "" },
      # Tambahkan total omzet untuk bulan yang difilter
      monthly_total: query.sum(:total_price)
    }
  end

  def destroy
    sale = Sale.find(params[:id])
    # Ingat: menghapus penjualan secara permanen biasanya tidak disarankan di akuntansi,
    # tapi untuk aplikasi ini oke saja.
    sale.destroy
    redirect_to sales_history_path, notice: "Transaksi berhasil dihapus!"
  end
end