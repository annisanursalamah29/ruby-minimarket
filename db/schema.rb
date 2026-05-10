# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_05_07_000005) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "categories", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "name"
    t.datetime "updated_at", null: false
  end

  create_table "customers", force: :cascade do |t|
    t.string "address"
    t.datetime "created_at", null: false
    t.string "email"
    t.string "membership_number"
    t.string "name", null: false
    t.string "phone"
    t.datetime "updated_at", null: false
  end

  create_table "products", force: :cascade do |t|
    t.string "barcode"
    t.bigint "category_id", null: false
    t.datetime "created_at", null: false
    t.string "name"
    t.decimal "price", precision: 10, scale: 2
    t.integer "stock"
    t.datetime "updated_at", null: false
    t.bigint "warehouse_id"
    t.index ["barcode"], name: "index_products_on_barcode", unique: true
    t.index ["category_id"], name: "index_products_on_category_id"
    t.index ["warehouse_id"], name: "index_products_on_warehouse_id"
  end

  create_table "purchase_items", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.decimal "price", precision: 12, scale: 2, default: "0.0", null: false
    t.bigint "product_id", null: false
    t.bigint "purchase_id", null: false
    t.integer "quantity", default: 1, null: false
    t.datetime "updated_at", null: false
    t.index ["product_id"], name: "index_purchase_items_on_product_id"
    t.index ["purchase_id"], name: "index_purchase_items_on_purchase_id"
  end

  create_table "purchases", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "document_number"
    t.text "notes"
    t.date "order_date", null: false
    t.date "received_at"
    t.integer "status", default: 0, null: false
    t.bigint "supplier_id", null: false
    t.decimal "total_price", precision: 12, scale: 2, default: "0.0", null: false
    t.datetime "updated_at", null: false
    t.bigint "warehouse_id"
    t.index ["supplier_id"], name: "index_purchases_on_supplier_id"
    t.index ["warehouse_id"], name: "index_purchases_on_warehouse_id"
  end

  create_table "sale_items", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.decimal "price", precision: 12, scale: 2
    t.bigint "product_id", null: false
    t.integer "quantity"
    t.bigint "sale_id", null: false
    t.datetime "updated_at", null: false
    t.index ["product_id"], name: "index_sale_items_on_product_id"
    t.index ["sale_id"], name: "index_sale_items_on_sale_id"
  end

  create_table "sales", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.decimal "total_price", precision: 12, scale: 2
    t.datetime "updated_at", null: false
  end

  create_table "stock_adjustments", force: :cascade do |t|
    t.integer "adjustment_type", default: 0, null: false
    t.datetime "created_at", null: false
    t.text "note"
    t.bigint "product_id", null: false
    t.integer "quantity", default: 0, null: false
    t.string "reason", null: false
    t.datetime "updated_at", null: false
    t.bigint "warehouse_id"
    t.index ["product_id"], name: "index_stock_adjustments_on_product_id"
    t.index ["warehouse_id"], name: "index_stock_adjustments_on_warehouse_id"
  end

  create_table "suppliers", force: :cascade do |t|
    t.text "address"
    t.string "contact_person"
    t.datetime "created_at", null: false
    t.string "email"
    t.string "name", null: false
    t.string "phone"
    t.text "terms"
    t.datetime "updated_at", null: false
  end

  create_table "users", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "email"
    t.string "password_digest"
    t.string "role", default: "admin", null: false
    t.datetime "updated_at", null: false
  end

  create_table "warehouses", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.text "description"
    t.string "location"
    t.string "name", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "products", "warehouses"
  add_foreign_key "purchase_items", "products"
  add_foreign_key "purchase_items", "purchases"
  add_foreign_key "purchases", "suppliers"
  add_foreign_key "purchases", "warehouses"
  add_foreign_key "sale_items", "products"
  add_foreign_key "sale_items", "sales"
  add_foreign_key "stock_adjustments", "products"
  add_foreign_key "stock_adjustments", "warehouses"
end
