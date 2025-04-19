import mongoose from 'mongoose';
import { User, Book } from './Schema.js';
import {
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    getCart,
    clearCart
} from './cartOperations.js';

// MongoDB connection URI
const MONGO_URI = "mongodb+srv://admin:admin@madreaders.dvcyjvw.mongodb.net/?retryWrites=true&w=majority&appName=madreaders";

// Mock data
const mockUsers = [
    {
        Name: "Cart Test User 1",
        Email: "cart_test_1_" + Date.now() + "@example.com",
        PhoneNumber: "1234567890",
        Address: "123 Test St"
    },
    {
        Name: "Cart Test User 2",
        Email: "cart_test_2_" + Date.now() + "@example.com",
        PhoneNumber: "0987654321",
        Address: "456 Test Ave"
    }
];

const mockBooks = [
    {
        BookID: "test-book-1-" + Date.now(),
        GoogleBooksID: "test1",
        Price: 29.99,
        StockQuantity: 5,
        EbookAvailability: true,
        title: "Test Book 1"
    },
    {
        BookID: "test-book-2-" + Date.now(),
        GoogleBooksID: "test2",
        Price: 19.99,
        StockQuantity: 3,
        EbookAvailability: false,
        title: "Test Book 2"
    },
    {
        BookID: "test-book-3-" + Date.now(),
        GoogleBooksID: "test3",
        Price: 24.99,
        StockQuantity: 0, // Out of stock for testing
        EbookAvailability: true,
        title: "Test Book 3"
    }
];

// Test function
async function testCartOperations() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Create test users
        const users = await User.insertMany(mockUsers);
        console.log(`✅ Created ${users.length} test users`);

        // Create test books
        const books = await Book.insertMany(mockBooks);
        console.log(`✅ Created ${books.length} test books`);

        const user1 = users[0];
        const user2 = users[1];

        // Test Scenario 1: Add items to cart
        console.log('\n🔹 Test Scenario 1: Adding items to cart');
        const addResult1 = await addToCart(user1._id, books[0].BookID, 2);
        console.log('Adding 2 copies of Book 1:', addResult1.success, addResult1.message);
        
        const addResult2 = await addToCart(user1._id, books[1].BookID, 1);
        console.log('Adding 1 copy of Book 2:', addResult2.success, addResult2.message);

        // Test Scenario 2: Try adding out-of-stock book
        console.log('\n🔹 Test Scenario 2: Adding out-of-stock book');
        const addOutOfStock = await addToCart(user1._id, books[2].BookID, 1);
        console.log('Adding out-of-stock book:', addOutOfStock.success, addOutOfStock.message);

        // Test Scenario 3: Try adding more than available stock
        console.log('\n🔹 Test Scenario 3: Adding more than available stock');
        const addTooMany = await addToCart(user1._id, books[0].BookID, 10);
        console.log('Adding 10 copies (more than stock):', addTooMany.success, addTooMany.message);

        // Test Scenario 4: View cart
        console.log('\n🔹 Test Scenario 4: Viewing cart');
        const viewCart = await getCart(user1._id);
        console.log('Cart contents:', viewCart.data.map(item => ({
            bookID: item.BookID,
            quantity: item.Quantity,
            bookDetails: item.bookDetails
        })));

        // Test Scenario 5: Update quantity
        console.log('\n🔹 Test Scenario 5: Updating quantities');
        const updateResult = await updateCartItemQuantity(user1._id, books[0].BookID, 3);
        console.log('Updating Book 1 quantity to 3:', updateResult.success, updateResult.message);

        // Test Scenario 6: Multiple users
        console.log('\n🔹 Test Scenario 6: Testing multiple users');
        await addToCart(user2._id, books[0].BookID, 1);
        const user2Cart = await getCart(user2._id);
        console.log('Second user cart items:', user2Cart.data.length);

        // Test Scenario 7: Remove item
        console.log('\n🔹 Test Scenario 7: Removing items');
        const removeResult = await removeFromCart(user1._id, books[1].BookID);
        console.log('Removing Book 2 from cart:', removeResult.success, removeResult.message);

        // Test Scenario 8: Clear cart
        console.log('\n🔹 Test Scenario 8: Clearing cart');
        const clearResult = await clearCart(user1._id);
        console.log('Clearing entire cart:', clearResult.success, clearResult.message);

        // Verify cart is empty
        const emptyCart = await getCart(user1._id);
        console.log('Cart items after clearing:', emptyCart.data.length);

        // Clean up: Delete test data
        await User.deleteMany({ _id: { $in: users.map(u => u._id) } });
        await Book.deleteMany({ BookID: { $in: mockBooks.map(b => b.BookID) } });
        console.log('\n✅ Test data cleaned up');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        // Close MongoDB connection
        await mongoose.connection.close();
        console.log('✅ MongoDB connection closed');
    }
}

// Run tests
console.log('🚀 Starting Cart Tests with Mock Data...\n');
testCartOperations()
    .catch(error => {
        console.error('❌ Fatal error:', error);
        process.exit(1);
    }); 