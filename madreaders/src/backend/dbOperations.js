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
import connectDB from "./db.js";

// Initialize connection
let dbConnection = null;

async function getConnection() {
  if (!dbConnection) {
    dbConnection = await connectDB();
  }
  return dbConnection;
}

// User Operations
export async function createUser(userData) {
  try {
    await getConnection();

    // Validate required fields
    const requiredFields = ["Name", "Email", "PhoneNumber", "Address"];
    for (const field of requiredFields) {
      if (!userData[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Create new user
    const newUser = await User.create({
      Name: userData.Name,
      Email: userData.Email,
      PhoneNumber: userData.PhoneNumber,
      Address: userData.Address,
      Role: userData.Role || "user",
    });

    return {
      success: true,
      user: newUser,
      message: "User created successfully",
    };
  } catch (error) {
    if (error.code === 11000) {
      throw new Error("Email already exists");
    }
    throw new Error(`Error creating user: ${error.message}`);
  }
}

export async function listUsers() {
  try {
    await getConnection();
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
    await getConnection();
    return await Coupon.create({
      code: couponData.code.toUpperCase(),
      DiscountPercentage: couponData.DiscountPercentage,
      ExpiryDate: couponData.ExpiryDate,
      MaxUses: couponData.MaxUses,
      UsedCount: 0,
    });
  } catch (error) {
    throw new Error(`Error creating coupon: ${error.message}`);
  }
}

export async function updateCoupon(couponId, updateData) {
  try {
    await getConnection();
    return await Coupon.findByIdAndUpdate(couponId, updateData, { new: true });
  } catch (error) {
    throw new Error(`Error updating coupon: ${error.message}`);
  }
}

export async function deleteCoupon(couponId) {
  try {
    await getConnection();
    return await Coupon.findByIdAndDelete(couponId);
  } catch (error) {
    throw new Error(`Error deleting coupon: ${error.message}`);
  }
}

// List only active coupons (not expired & not fully used)
export async function listCoupons() {
  try {
    await getConnection();
    const today = new Date();
    return await Coupon.find({
      ExpiryDate: { $gt: today },
      $expr: { $lt: ["$UsedCount", "$MaxUses"] },
    });
  } catch (error) {
    throw new Error(`Error listing coupons: ${error.message}`);
  }
}

// Validate if coupon can be used
export async function validateCoupon(couponId) {
  try {
    await getConnection();
    const coupon = await Coupon.findById(couponId);
    if (!coupon) throw new Error("Coupon not found");
    if (coupon.ExpiryDate < new Date()) throw new Error("Coupon has expired");
    if (coupon.UsedCount >= coupon.MaxUses)
      throw new Error("Coupon usage limit exceeded");
    return coupon;
  } catch (error) {
    throw new Error(`Error validating coupon: ${error.message}`);
  }
}

// Discount calculation using coupon
export async function calculateDiscount(couponId, amount) {
  try {
    const coupon = await validateCoupon(couponId);
    const discountAmount = (amount * coupon.DiscountPercentage) / 100;
    return {
      originalAmount: amount,
      discountPercentage: coupon.DiscountPercentage,
      discountAmount,
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
      Name: formData.name,
      Email: formData.email,
      Subject: formData.subject,
      Message: formData.message,
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

export async function updateContactStatus(id, newStatus) {
  try {
    return await Contact.findByIdAndUpdate(
      id,
      { Status: newStatus },
      { new: true }
    );
  } catch (err) {
    throw new Error(`Error updating contact status: ${err.message}`);
  }
}

// // Test function to demonstrate createUser
// async function testCreateUser() {
//   try {
//     const testUser = {
//       Name: "Test User",
//       Email: "test@exampdsle.com",
//       PhoneNumber: "1sds234567890",
//       Address: "123 Test Street",
//       Role: "user",
//     };

//     const result = await createUser(testUser);
//     console.log("Test User Creation Result:", result);

//     // List all users to verify
//     const users = await listUsers();
//     console.log("All Users:", users);
//   } catch (error) {
//     console.error("Test Error:", error.message);
//   }
// }

// // Uncomment the line below to run the test
// testCreateUser();
