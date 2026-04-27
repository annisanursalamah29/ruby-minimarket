class SalesController < ApplicationController
  before_action :authenticate_user!
  
  skip_before_action :verify_authenticity_token

  def new
    products = Product.where("stock > 0") # Hanya tampilkan barang yang ada stoknya
    render inertia: 'Sales/Cashier', props: { products: products }
  end

  def create
    # Transaksi database agar jika satu gagal, semua batal (aman)
    ActiveRecord::Base.transaction do
      sale = Sale.create!(total_price: params[:total_price])
      
      params[:items].each do |item|
        sale.sale_items.create!(
          product_id: item[:product_id],
          quantity: item[:quantity],
          price: item[:price]
        )
      end
    end
    redirect_to sales_new_path, notice: "Transaksi Berhasil!"
  end

  def show
    @sale = Sale.find(params[:id])
    render inertia: 'Sales/Receipt', props: { 
      sale: @sale.as_json(include: { sale_items: { include: :product } }) 
    }
  end

  def history
  month_filter = params[:month]
  
  # Pastikan order(created_at: :desc) dipanggil di awal query
  query = Sale.includes(sale_items: :product).order(created_at: :desc)

  if month_filter.present?
    start_date = Date.parse("#{month_filter}-01")
    end_date = start_date.end_of_month
    query = query.where(created_at: start_date.beginning_of_day..end_date.end_of_day)
  end

  # Gunakan kaminari atau pagy untuk paginasi
  paginated_sales = query.page(params[:page]).per(10)

  render inertia: 'Sales/History', props: {
    sales: {
      # as_json akan mengikuti urutan query di atas
      data: paginated_sales.as_json(include: { sale_items: { include: :product } }),
      current_page: paginated_sales.current_page,
      total_pages: paginated_sales.total_pages,
      total_count: paginated_sales.total_count,
      is_first_page: paginated_sales.first_page?,
      is_last_page: paginated_sales.last_page?,
      next_page: paginated_sales.next_page,
      prev_page: paginated_sales.prev_page
    },
    filters: { month: month_filter || "" }
    }
  end

  def destroy
    sale = Sale.find(params[:id])
    sale.destroy
    redirect_to sales_history_path, notice: "Transaksi berhasil dihapus!"
  end
  
end