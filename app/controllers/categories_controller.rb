class CategoriesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_category, only: %i[update destroy]

  def index
    @categories = Category.order(:name)
    render inertia: 'MasterData/Categories', props: {
      categories: @categories
    }
    
    # 3. Terapkan Paginasi di akhir
    paginated_query = query.page(params[:page]).per(1) #

    @low_stock_count = Category.where("stock < ?", 1).count #
    
    render inertia: 'Categories/Stock', props: { 
      categories: {
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
      filters: params.slice(:name, :page),
      lowStockCount: @low_stock_count
    }
  end

  def create
    @category = Category.new(category_params)
    
    if @category.save
      redirect_to categories_path, notice: 'Kategori berhasil ditambahkan'
    else
      # Jangan gunakan redirect_back untuk error validasi. 
      # Inertia secara otomatis menangkap error jika kita merender kembali index 
      # atau menggunakan redirect dengan error object.
      redirect_to categories_path, inertia: { errors: @category.errors }
    end
  end

  def update
    if @category.update(category_params)
      redirect_to categories_path, notice: 'Kategori berhasil diperbarui'
    else
      redirect_to categories_path, inertia: { errors: @category.errors }
    end
  end

  def destroy
    # Pastikan kategori tidak sedang digunakan sebelum dihapus (opsional)
    if @category.destroy
      redirect_to categories_path, notice: 'Kategori berhasil dihapus'
    else
      redirect_to categories_path, alert: 'Gagal menghapus kategori'
    end
  end

  private

  def set_category
    @category = Category.find(params[:id])
  end

  def category_params
    # Pastikan nama di-trim agar "Baju " dan "Baju" dianggap sama
    params.require(:category).permit(:name).tap do |p|
      p[:name] = p[:name].strip if p[:name]
    end
  end
end