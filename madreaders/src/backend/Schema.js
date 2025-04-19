import mongoose from "mongoose";

const { Schema, model } = mongoose;

// 🔹 User Schema
const UserSchema = new Schema({
  Name: { type: String, required: true },
  Email: { type: String, required: true, unique: true },
  PhoneNumber: { type: String, required: true },
  Address: { type: String, required: true },
  Role: { type: String, default: "user", enum: ["user", "admin"] },
  CreatedAt: { type: Date, default: Date.now },
});

// Create indexes
UserSchema.index({ Email: 1 }, { unique: true });

// 🔹 Book Schema
const BookSchema = new Schema({
  BookID: { type: String, required: true, unique: true },
  GoogleBooksID: String,
  Price: { type: Number, required: true },
  StockQuantity: { type: Number, required: true, default: 0 },
  EbookAvailability: { type: Boolean, default: false },
  Orders: [{ type: Schema.Types.ObjectId, ref: "Order" }],
});

// 🔹 Order Schema
const OrderSchema = new Schema({
  UserID: { type: Schema.Types.ObjectId, ref: "User", required: true },
  TotalAmount: { type: Number, required: true },
  OrderStatus: {
    type: String,
    required: true,
    enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
    default: "Pending",
  },
  CreatedAt: { type: Date, default: Date.now },
});

// 🔹 OrderItem Schema
const OrderItemSchema = new Schema({
  OrderID: { type: Schema.Types.ObjectId, ref: "Order", required: true },
  BookID: { type: String, required: true },
  Price: { type: Number, required: true },
  Quantity: { type: Number, required: true, min: 1 },
});

// 🔹 Payment Schema
const PaymentSchema = new Schema({
  OrderID: { type: Schema.Types.ObjectId, ref: "Order", required: true },
  UserID: { type: Schema.Types.ObjectId, ref: "User", required: true },
  CouponID: { type: Schema.Types.ObjectId, ref: "Coupon" },
  PaymentMethod: {
    type: String,
    required: true,
    enum: ["CreditCard", "PayPal", "CashOnDelivery"],
  },
  Amount: { type: Number, required: true },
  Status: {
    type: String,
    required: true,
    enum: ["Pending", "Completed", "Failed"],
    default: "Pending",
  },
  CreatedAt: { type: Date, default: Date.now },
});

// 🔹 Coupon Schema
const CouponSchema = new Schema({
  DiscountPercentage: { type: Number, required: true, min: 0, max: 100 },
  ExpiryDate: { type: Date, required: true },
  MaxUses: { type: Number, required: true, min: 1 },
  UsedCount: { type: Number, default: 0 },
});

// 🔹 Wishlist Schema
const WishlistSchema = new Schema({
  UserID: { type: Schema.Types.ObjectId, ref: "User", required: true },
  BookID: { type: String, required: true },
  AddedAt: { type: Date, default: Date.now },
});

// Create compound index to prevent duplicate wishlist entries
WishlistSchema.index({ UserID: 1, BookID: 1 }, { unique: true });

// 🔹 Review Schema
const ReviewSchema = new Schema({
  UserID: { type: Schema.Types.ObjectId, ref: "User", required: true },
  BookID: { type: String, required: true },
  Rating: { type: Number, required: true, min: 1, max: 5 },
  Comment: { type: String, required: true },
  CreatedAt: { type: Date, default: Date.now },
});

// Create compound index to prevent multiple reviews from same user for same book
ReviewSchema.index({ UserID: 1, BookID: 1 }, { unique: true });

// 🔹 ShoppingCart Schema
const ShoppingCartSchema = new Schema({
  UserID: { type: Schema.Types.ObjectId, ref: "User", required: true },
  BookID: { type: String, required: true },
  Quantity: { type: Number, required: true, min: 1 },
  AddedAt: { type: Date, default: Date.now },
});

// Create compound index to prevent duplicate cart entries
ShoppingCartSchema.index({ UserID: 1, BookID: 1 }, { unique: true });

// 🔹 Contact Schema
const ContactSchema = new Schema({
  Name: { type: String, required: true },
  Email: { type: String, required: true },
  Subject: { type: String, required: true },
  Message: { type: String, required: true },
  CreatedAt: { type: Date, default: Date.now },
  Status: {
    type: String,
    default: "Unread",
    enum: ["Unread", "Read", "Responded"],
  },
});

// Drop all existing collections and their indexes before creating new ones
async function resetCollections() {
  const collections = Object.keys(mongoose.connection.collections);
  for (const collectionName of collections) {
    await mongoose.connection.collections[collectionName].drop();
  }
}

// 🔸 Export models
export const User = model("User", UserSchema);
export const Book = model("Book", BookSchema);
export const Order = model("Order", OrderSchema);
export const OrderItem = model("OrderItem", OrderItemSchema);
export const Payment = model("Payment", PaymentSchema);
export const Coupon = model("Coupon", CouponSchema);
export const Wishlist = model("Wishlist", WishlistSchema);
export const Review = model("Review", ReviewSchema);
export const ShoppingCart = model("ShoppingCart", ShoppingCartSchema);
export const Contact = model("Contact", ContactSchema);

// Export reset function
export const resetDatabase = resetCollections;
