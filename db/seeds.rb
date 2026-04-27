Category.destroy_all
makanan = Category.create!(name: "Makanan")
minuman = Category.create!(name: "Minuman")
atk = Category.create!(name: "Alat Tulis")

Product.create!([
  { name: "Indomie", stock: 50, price: 3100, category: makanan },
  { name: "Le Minerale", stock: 100, price: 3500, category: minuman },
  { name: "Buku Sinar Dunia", stock: 20, price: 5000, category: atk }
])

puts "Berhasil menambahkan #{Product.count} barang ke minimarket!"