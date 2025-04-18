import mongoose from "mongoose";
import {
  User,
  Book,
  Order,
  OrderItem,
  Payment,
  Coupon,
  Wishlist,
  Review,
  ShoppingCart,
} from "./Schema.js"; // adjust path if needed

const uri =
  "mongodb+srv://admin:admin@madreaders.dvcyjvw.mongodb.net/?retryWrites=true&w=majority&appName=madreaders";

async function runTests() {
  try {
    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB");

    // 🧪 Insert Dummy User
    const user = await User.create({
      Name: "Test User",
      Email: "testuser@example.com",
      PhoneNumber: "123456789",
      Address: "Beirut",
    });
    console.log("✅ User:", user);

    // 🧪 Insert Dummy Book
    const book = await Book.create({
      BookID: "BOOK123",
      GoogleBooksID: "gbooks_123",
      Price: 15.99,
      StockQuantity: 10,
      EbookAvailability: true,
      Orders: [],
    });
    console.log("✅ Book:", book);

    // 🧪 Insert Dummy Order
    const order = await Order.create({
      UserID: user._id,
      TotalAmount: 15.99,
      OrderStatus: "Pending",
    });
    console.log("✅ Order:", order);

    // 🧪 Insert Dummy OrderItem
    const orderItem = await OrderItem.create({
      OrderID: order._id,
      BookID: book.BookID,
      Price: 15.99,
      Quantity: 1,
    });
    console.log("✅ OrderItem:", orderItem);

    // 🧪 Insert Dummy Coupon
    const coupon = await Coupon.create({
      DiscountPercentage: 10,
      ExpiryDate: new Date("2025-12-31"),
      MaxUses: 100,
    });
    console.log("✅ Coupon:", coupon);

    // 🧪 Insert Dummy Payment
    const payment = await Payment.create({
      OrderID: order._id,
      UserID: user._id,
      CouponID: coupon._id,
      PaymentMethod: "CreditCard",
      Amount: 14.39, // with discount
      Status: "Completed",
    });
    console.log("✅ Payment:", payment);

    // 🧪 Insert Dummy Wishlist
    const wishlist = await Wishlist.create({
      UserID: user._id,
      BookID: book.BookID,
    });
    console.log("✅ Wishlist:", wishlist);

    // 🧪 Insert Dummy Review
    const review = await Review.create({
      UserID: user._id,
      BookID: book.BookID,
      Rating: 5,
      Comment: "Amazing read!",
    });
    console.log("✅ Review:", review);

    // 🧪 Insert Dummy ShoppingCart
    const cart = await ShoppingCart.create({
      UserID: user._id,
      BookID: book.BookID,
      Quantity: 2,
    });
    console.log("✅ ShoppingCart:", cart);
  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

runTests();
