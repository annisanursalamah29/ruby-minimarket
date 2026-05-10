class ProductsController < ApplicationController
  before_action :authenticate_user!
  # Tetap aktifkan CSRF protection untuk keamanan
  
  def table
    @categories = Category.all
    
    # 1. Mulai dengan query dasar (Base Query)
    query = Product.includes(:category).order(created_at: :desc)
    
    # 2. Terapkan Filter (sebelum paginasi agar total_count akurat)
    if params[:barcode].present?
      query = query.where("barcode LIKE ?", "%#{params[:barcode]}%")
    end

    if params[:category_id].present?
      query = query.where(category_id: params[:category_id])
    end

    # 3. Terapkan Paginasi di akhir
    paginated_query = query.page(params[:page]).per(1) #

    @low_stock_count = Product.where("stock < ?", 1).count #
    
    render inertia: 'Products/Stock', props: { 
      products: {
        data: paginated_query.as_json(include: :category), #
        current_page: paginated_query.current_page,        #
        total_pages: paginated_query.total_pages,          #
        total_count: query.count,                          # Total data setelah difilter
        is_first_page: paginated_query.first_page?,        #
        is_last_page: paginated_query.last_page?,          #
        next_page: paginated_query.next_page,              #
        prev_page: paginated_query.prev_page               #
      },
      categories: @categories,
      filters: params.slice(:barcode, :category_id, :page),
      lowStockCount: @low_stock_count
    }
  end

  def store
    @product = Product.new(product_params)
    
    if @product.save
      # Gunakan redirect_to langsung ke path tujuan untuk kepastian
      redirect_to products_table_path, notice: "Produk berhasil ditambahkan."
    else
      # PENTING: Jangan gunakan alert/flash manual untuk error validasi di Inertia.
      # Cukup redirect back, Inertia akan otomatis mengirimkan object 'errors' ke frontend.
      redirect_back fallback_location: products_table_path
    end
  end

  def update
    @product = Product.find(params[:id])
    if @product.update(product_params)
      redirect_to products_table_path, notice: "Produk berhasil diperbarui."
    else
      # Redirect back dengan status 303 (default rails untuk redirect di metode non-GET)
      redirect_back fallback_location: products_table_path
    end
  end

  def destroy
    product = Product.find(params[:id])
    product.destroy
    
    # Gunakan status 303 untuk penghapusan agar Inertia melakukan re-fetch data dengan benar
    redirect_to products_table_path, status: :see_other, notice: "Produk berhasil dihapus."
  end

  private

  def product_params
    # Pastikan nama parameter sesuai dengan yang dikirim dari Vue/React (wrap dalam :product)
    params.require(:product).permit(:barcode, :name, :stock, :price, :category_id)
  end
end