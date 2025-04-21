import { Order, OrderItem, Cart, Coupon } from "./Schema.js";
import connectDB from "./db.js";

export async function submitOrder(username, userInfo, couponCode = null) {
  await connectDB();

  try {
    // 1. Fetch all cart items for the user
    const cartItems = await Cart.find({ Username: username });
    if (cartItems.length === 0) {
      return { success: false, message: "Cart is empty." };
    }

    // 2. Validate coupon if provided
    let discount = 0;
    let appliedCouponCode = null;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode });
      if (
        coupon &&
        coupon.ExpiryDate >= new Date() &&
        coupon.UsedCount < coupon.MaxUses
      ) {
        discount = coupon.DiscountPercentage;
        appliedCouponCode = coupon.code;
        // Optionally increment coupon usage later
      } else {
        return { success: false, message: "Invalid or expired coupon." };
      }
    }

    // 3. Calculate total
    let totalAmount = 0;
    cartItems.forEach((item) => {
      totalAmount += item.Price * item.Quantity;
    });

    const discountedTotal = totalAmount * (1 - discount / 100);

    // 4. Create the Order
    const newOrder = new Order({
      UserID: username,
      OrderDate: new Date(),
      OrderStatus: "Pending",
      TotalAmount: discountedTotal,
      CouponCode: appliedCouponCode,
      ShippingInfo: userInfo,
    });
    await newOrder.save();

    // 5. Create OrderItems
    for (const item of cartItems) {
      await OrderItem.create({
        OrderID: newOrder._id,
        BookID: item.BookID,
        Quantity: item.Quantity,
        Price: item.Price,
      });
    }

    // 6. Optionally increment coupon usage
    if (appliedCouponCode) {
      await Coupon.updateOne(
        { code: appliedCouponCode },
        { $inc: { UsedCount: 1 } }
      );
    }

    // 7. Clear the user's cart
    await Cart.deleteMany({ Username: username });

    return {
      success: true,
      message: "Order placed successfully",
      orderId: newOrder._id,
    };
  } catch (err) {
    console.error("❌ Error during checkout:", err);
    return { success: false, message: "Checkout failed" };
  }
}
