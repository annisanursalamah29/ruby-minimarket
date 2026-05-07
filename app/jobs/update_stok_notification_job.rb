class UpdateStokNotificationJob < ApplicationJob
  queue_as :default

  def perform(product_id)
    product = Product.find(product_id)
    # Simulasi tugas berat, misalnya mengirim data ke pusat atau kalkulasi rumit
    puts "--- Memproses notifikasi untuk produk: #{product.name} ---"
    sleep 5 # Pura-puranya tugas berat selama 5 detik
    puts "--- Selesai memproses #{product.name} ---"
  end
end