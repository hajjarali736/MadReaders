import { Cart } from "./Schema.js";
import { Coupon } from "./Schema.js";

// Add to cart
export async function addToCart(username, bookID, price, quantity) {
  try {
    const cartItem = await Cart.findOneAndUpdate(
      { Username: username, BookID: bookID },
      {
        $set: {
          Price: price,
        },
        $inc: { Quantity: quantity },
      },
      { upsert: true, new: true }
    );

    return { success: true, data: cartItem };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// Get full cart
export async function getCart(username) {
  try {
    const items = await Cart.find({ Username: username });
    return { success: true, data: items };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// Update quantity
export async function updateCartItemQuantity(username, bookID, newQuantity) {
  try {
    const updated = await Cart.findOneAndUpdate(
      { Username: username, BookID: bookID },
      { Quantity: newQuantity },
      { new: true }
    );
    return { success: true, data: updated };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// Remove item
export async function removeFromCart(username, bookID) {
  try {
    await Cart.findOneAndDelete({ Username: username, BookID: bookID });
    return { success: true, message: "Item removed" };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// Count items in cart
export async function countCartItems(username) {
  try {
    const count = await Cart.countDocuments({ Username: username });
    return { success: true, count };
  } catch (error) {
    return { success: false, message: error.message };
  }
}
