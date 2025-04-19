import mongoose from "mongoose";
import {
  User,
  Coupon,
  Order,
  OrderItem,
  Contact,
  ShoppingCart,
  Wishlist,
  Review,
} from "./Schema.js";

// User Operations
export async function listUsers() {
  try {
    return await User.find({});
  } catch (error) {
    throw new Error(`Error listing users: ${error.message}`);
  }
}

export async function getUserById(userId) {
  try {
    return await User.findById(userId);
  } catch (error) {
    throw new Error(`Error getting user: ${error.message}`);
  }
}

export async function updateUser(userId, updateData) {
  try {
    return await User.findByIdAndUpdate(userId, updateData, { new: true });
  } catch (error) {
    throw new Error(`Error updating user: ${error.message}`);
  }
}

export async function deleteUser(userId) {
  try {
    // First check if user exists
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Delete associated data
    await Order.deleteMany({ UserID: userId });
    await ShoppingCart.deleteMany({ UserID: userId });
    await Wishlist.deleteMany({ UserID: userId });
    await Review.deleteMany({ UserID: userId });

    // Finally delete the user
    await User.findByIdAndDelete(userId);
    return {
      success: true,
      message: "User and associated data deleted successfully",
    };
  } catch (error) {
    throw new Error(`Error deleting user: ${error.message}`);
  }
}

// Coupon Operations
export async function createCoupon(couponData) {
  try {
    return await Coupon.create({
      ...couponData,
      UsedCount: 0,
    });
  } catch (error) {
    throw new Error(`Error creating coupon: ${error.message}`);
  }
}

export async function updateCoupon(couponId, updateData) {
  try {
    return await Coupon.findByIdAndUpdate(couponId, updateData, { new: true });
  } catch (error) {
    throw new Error(`Error updating coupon: ${error.message}`);
  }
}

export async function validateCoupon(couponId) {
  try {
    const coupon = await Coupon.findById(couponId);
    if (!coupon) {
      throw new Error("Coupon not found");
    }

    // Check expiration
    if (coupon.ExpiryDate < new Date()) {
      throw new Error("Coupon has expired");
    }

    // Check usage limit
    if (coupon.UsedCount >= coupon.MaxUses) {
      throw new Error("Coupon usage limit exceeded");
    }

    return coupon;
  } catch (error) {
    throw new Error(`Error validating coupon: ${error.message}`);
  }
}

export async function calculateDiscount(couponId, amount) {
  try {
    const coupon = await validateCoupon(couponId);
    const discountAmount = (amount * coupon.DiscountPercentage) / 100;
    return {
      originalAmount: amount,
      discountPercentage: coupon.DiscountPercentage,
      discountAmount: discountAmount,
      finalAmount: amount - discountAmount,
    };
  } catch (error) {
    throw new Error(`Error calculating discount: ${error.message}`);
  }
}

// Order Operations
export async function getOrders(userId = null) {
  try {
    const query = userId ? { UserID: userId } : {};
    return await Order.find(query).populate("UserID");
  } catch (error) {
    throw new Error(`Error fetching orders: ${error.message}`);
  }
}

export async function getOrderDetails(orderId) {
  try {
    const order = await Order.findById(orderId).populate("UserID");
    const orderItems = await OrderItem.find({ OrderID: orderId });
    return { order, items: orderItems };
  } catch (error) {
    throw new Error(`Error fetching order details: ${error.message}`);
  }
}

export async function updateOrderStatus(orderId, newStatus) {
  try {
    return await Order.findByIdAndUpdate(
      orderId,
      { OrderStatus: newStatus },
      { new: true }
    );
  } catch (error) {
    throw new Error(`Error updating order status: ${error.message}`);
  }
}

export async function cancelOrder(orderId) {
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error("Order not found");
    }

    if (order.OrderStatus === "Delivered") {
      throw new Error("Cannot cancel a delivered order");
    }

    return await Order.findByIdAndUpdate(
      orderId,
      { OrderStatus: "Cancelled" },
      { new: true }
    );
  } catch (error) {
    throw new Error(`Error cancelling order: ${error.message}`);
  }
}

// Contact Form Operations
export async function submitContactForm(formData) {
  try {
    return await Contact.create({
      ...formData,
      CreatedAt: new Date(),
    });
  } catch (error) {
    throw new Error(`Error submitting contact form: ${error.message}`);
  }
}

export async function getContactSubmissions() {
  try {
    return await Contact.find({}).sort({ CreatedAt: -1 });
  } catch (error) {
    throw new Error(`Error getting contact submissions: ${error.message}`);
  }
}
