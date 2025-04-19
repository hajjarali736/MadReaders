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
  Contact,
} from "./Schema.js";

import * as db from "./dbOperations.js";

const uri =
  "mongodb+srv://admin:admin@madreaders.dvcyjvw.mongodb.net/?retryWrites=true&w=majority&appName=madreaders";

async function cleanup() {
  console.log("🧹 Cleaning up previous test data...");
  await User.deleteMany({ Email: /^test.*@example\.com$/ });
  await Order.deleteMany({});
  await OrderItem.deleteMany({});
  await Coupon.deleteMany({});
  await Contact.deleteMany({ Email: /^contact.*@test\.com$/ });
}

async function runTests() {
  try {
    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB");

    // Clean up any previous test data
    await cleanup();

    // Test User Operations
    console.log("\n🧪 Testing User Operations:");
    const timestamp = Date.now();
    const user = await User.create({
      Name: "Test User",
      Email: `test.${timestamp}@example.com`,
      PhoneNumber: "+961123456789",
      Address: "123 Test St",
      Role: "user",
    });
    console.log("✅ Created test user:", user);

    const users = await db.listUsers();
    console.log(`✅ Listed ${users.length} users`);

    // Test Coupon Operations
    console.log("\n🧪 Testing Coupon Operations:");
    const coupon = await db.createCoupon({
      DiscountPercentage: 20,
      ExpiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      MaxUses: 100,
    });
    console.log("✅ Created coupon:", coupon);

    const validationResult = await db.validateCoupon(coupon._id);
    console.log("✅ Validated coupon:", validationResult);

    const discountCalc = await db.calculateDiscount(coupon._id, 100);
    console.log("✅ Calculated discount:", discountCalc);

    // Test Order Operations
    console.log("\n🧪 Testing Order Operations:");
    const order = await Order.create({
      UserID: user._id,
      TotalAmount: 99.99,
      OrderStatus: "Pending",
    });
    console.log("✅ Created order:", order);

    const orderItem = await OrderItem.create({
      OrderID: order._id,
      BookID: "TEST123",
      Price: 99.99,
      Quantity: 1,
    });
    console.log("✅ Created order item:", orderItem);

    const updatedOrder = await db.updateOrderStatus(order._id, "Processing");
    console.log("✅ Updated order status:", updatedOrder);

    const orderDetails = await db.getOrderDetails(order._id);
    console.log("✅ Got order details:", orderDetails);

    // Test Contact Form Operations
    console.log("\n🧪 Testing Contact Form Operations:");
    const contact = await db.submitContactForm({
      Name: "Test Contact",
      Email: `contact.${timestamp}@test.com`,
      Subject: "Test Subject",
      Message: "This is a test message",
    });
    console.log("✅ Submitted contact form:", contact);

    const submissions = await db.getContactSubmissions();
    console.log(`✅ Retrieved ${submissions.length} contact submissions`);

    // Final Cleanup
    console.log("\n🧹 Cleaning up test data...");
    await User.deleteOne({ _id: user._id });
    await Order.deleteOne({ _id: order._id });
    await OrderItem.deleteOne({ _id: orderItem._id });
    await Coupon.deleteOne({ _id: coupon._id });
    await Contact.deleteOne({ _id: contact._id });
    console.log("✅ Cleanup completed");
  } catch (err) {
    if (err.code === 11000) {
      console.error(
        "❌ Duplicate key error. This usually means test data wasn't properly cleaned up."
      );
      console.error("Running cleanup and please try again...");
      await cleanup();
    } else {
      console.error("❌ Error:", err.message);
    }
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

runTests();
