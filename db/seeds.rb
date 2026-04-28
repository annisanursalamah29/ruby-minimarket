Category.destroy_all
makanan = Category.create!(name: "Foods")
minuman = Category.create!(name: "Drinks")
atk = Category.create!(name: "Stationery")

Product.create!([
  { barcode: "1234567890123", name: "Indomie", stock: 50, price: 3100, category: makanan },
  { barcode: "1234567890124", name: "Le Minerale", stock: 100, price: 3500, category: minuman },
  { barcode: "1234567890125", name: "Buku Sinar Dunia", stock: 20, price: 5000, category: atk }
])

puts "Berhasil menambahkan #{Product.count} barang ke minimarket!"