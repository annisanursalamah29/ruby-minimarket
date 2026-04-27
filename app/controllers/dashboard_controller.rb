class DashboardController < ApplicationController
  before_action :authenticate_user!

  def index
    # Statistik Utama
    @total_products = Product.count
    @low_stock_count = Product.where("stock < ?", 10).count
    @total_sales_today = Sale.where("created_at >= ?", Time.zone.now.beginning_of_day).sum(:total_price)
    @total_transactions_today = Sale.where("created_at >= ?", Time.zone.now.beginning_of_day).count

    # Data untuk grafik (7 hari terakhir)
    @sales_chart = Sale.where("created_at >= ?", 7.days.ago)
                       .group("DATE(created_at)")
                       .sum(:total_price)

    render inertia: 'Dashboard/Index', props: {
      stats: {
        totalProducts: @total_products,
        lowStock: @low_stock_count,
        todaySales: @total_sales_today,
        todayTransactions: @total_transactions_today
      },
      chartData: @sales_chart.map { |date, total| { date: date.strftime("%d %b"), total: total } }
    }
  end
end