# Menghapus semua data yang ada di tabel terkait
# Urutan penghapusan penting jika ada foreign key (relasi)
StockAdjustment.destroy_all
Product.destroy_all
Category.destroy_all
Warehouse.destroy_all

puts "Database berhasil dikosongkan. Tidak ada data awal yang dibuat."