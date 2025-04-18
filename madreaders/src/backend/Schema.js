import mongoose from "mongoose";

const { Schema, model } = mongoose;

// 🔹 User Schema
const UserSchema = new Schema({
  Name: String,
  Email: { type: String, unique: true },
  PhoneNumber: String,
  Address: String,
  Role: { type: String, default: "user" },
  CreatedAt: { type: Date, default: Date.now },
});

// 🔹 Book Schema
const BookSchema = new Schema({
  BookID: { type: String, required: true },
  GoogleBooksID: String,
  Price: Number,
  StockQuantity: Number,
  EbookAvailability: Boolean,
  Orders: [Number],
});

// 🔹 Order Schema
const OrderSchema = new Schema({
  UserID: { type: Schema.Types.ObjectId, ref: "User" },
  TotalAmount: Number,
  OrderStatus: String,
  CreatedAt: { type: Date, default: Date.now },
});

// 🔹 OrderItem Schema
const OrderItemSchema = new Schema({
  OrderID: { type: Schema.Types.ObjectId, ref: "Order" },
  BookID: String,
  Price: Number,
  Quantity: Number,
});

// 🔹 Payment Schema
const PaymentSchema = new Schema({
  OrderID: { type: Schema.Types.ObjectId, ref: "Order" },
  UserID: { type: Schema.Types.ObjectId, ref: "User" },
  CouponID: { type: Schema.Types.ObjectId, ref: "Coupon" },
  PaymentMethod: String,
  Amount: Number,
  Status: String,
  CreatedAt: { type: Date, default: Date.now },
});

// 🔹 Coupon Schema
const CouponSchema = new Schema({
  DiscountPercentage: Number,
  ExpiryDate: Date,
  MaxUses: Number,
  UsedCount: { type: Number, default: 0 },
});

// 🔹 Wishlist Schema
const WishlistSchema = new Schema({
  UserID: { type: Schema.Types.ObjectId, ref: "User" },
  BookID: String,
  AddedAt: { type: Date, default: Date.now },
});

// 🔹 Review Schema
const ReviewSchema = new Schema({
  UserID: { type: Schema.Types.ObjectId, ref: "User" },
  BookID: String,
  Rating: Number,
  Comment: String,
  CreatedAt: { type: Date, default: Date.now },
});

// 🔹 ShoppingCart Schema
const ShoppingCartSchema = new Schema({
  UserID: { type: Schema.Types.ObjectId, ref: "User" },
  BookID: String,
  Quantity: Number,
  AddedAt: { type: Date, default: Date.now },
});

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
