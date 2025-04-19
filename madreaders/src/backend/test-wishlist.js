import mongoose from 'mongoose';
import { User, Book } from './Schema.js';
import {
    addToWishlist,
    removeFromWishlist,
    getWishlist,
    isBookInWishlist
} from './wishlistOperations.js';

// MongoDB connection URI
const MONGO_URI = "mongodb+srv://admin:admin@madreaders.dvcyjvw.mongodb.net/?retryWrites=true&w=majority&appName=madreaders";

// Mock data
const mockUsers = [
    {
        Name: "John Doe",
        Email: "john_test_" + Date.now() + "@example.com",
        PhoneNumber: "1234567890",
        Address: "123 Main St"
    },
    {
        Name: "Jane Smith",
        Email: "jane_test_" + Date.now() + "@example.com",
        PhoneNumber: "0987654321",
        Address: "456 Oak Ave"
    }
];

const mockBooks = [
    {
        BookID: "test-book-1-" + Date.now(),
        GoogleBooksID: "abc123",
        Price: 29.99,
        StockQuantity: 10,
        EbookAvailability: true
    },
    {
        BookID: "test-book-2-" + Date.now(),
        GoogleBooksID: "def456",
        Price: 19.99,
        StockQuantity: 5,
        EbookAvailability: false
    },
    {
        BookID: "test-book-3-" + Date.now(),
        GoogleBooksID: "ghi789",
        Price: 24.99,
        StockQuantity: 15,
        EbookAvailability: true
    }
];

// Test function
async function testWishlistWithMockData() {
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

        // Test Scenario 1: User adds multiple books to wishlist
        console.log('\n🔹 Test Scenario 1: Adding multiple books to wishlist');
        const user1 = users[0];
        for (const book of books) {
            const result = await addToWishlist(user1._id, book.BookID);
            console.log(`Adding ${book.BookID} to ${user1.Name}'s wishlist:`, result.success);
        }

        // Test Scenario 2: Check user's wishlist
        console.log('\n🔹 Test Scenario 2: Checking wishlist contents');
        const wishlist = await getWishlist(user1._id);
        console.log(`${user1.Name}'s wishlist has ${wishlist.data.length} items:`, 
            wishlist.data.map(item => item.BookID));

        // Test Scenario 3: Try adding duplicate book
        console.log('\n🔹 Test Scenario 3: Testing duplicate prevention');
        const duplicateResult = await addToWishlist(user1._id, books[0].BookID);
        console.log('Attempting to add duplicate book:', duplicateResult);

        // Test Scenario 4: Multiple users with wishlists
        console.log('\n🔹 Test Scenario 4: Multiple users with wishlists');
        const user2 = users[1];
        await addToWishlist(user2._id, books[0].BookID);
        await addToWishlist(user2._id, books[1].BookID);
        
        const user2Wishlist = await getWishlist(user2._id);
        console.log(`${user2.Name}'s wishlist has ${user2Wishlist.data.length} items:`,
            user2Wishlist.data.map(item => item.BookID));

        // Test Scenario 5: Remove books from wishlist
        console.log('\n🔹 Test Scenario 5: Removing books from wishlist');
        const removeResult = await removeFromWishlist(user1._id, books[0].BookID);
        console.log('Removed book from wishlist:', removeResult.success);
        
        const updatedWishlist = await getWishlist(user1._id);
        console.log(`${user1.Name}'s updated wishlist has ${updatedWishlist.data.length} items:`,
            updatedWishlist.data.map(item => item.BookID));

        // Test Scenario 6: Check specific books in wishlist
        console.log('\n🔹 Test Scenario 6: Checking specific books');
        const checkResult1 = await isBookInWishlist(user1._id, books[0].BookID);
        const checkResult2 = await isBookInWishlist(user1._id, books[1].BookID);
        console.log(`Is ${books[0].BookID} in ${user1.Name}'s wishlist?`, checkResult1.isInWishlist);
        console.log(`Is ${books[1].BookID} in ${user1.Name}'s wishlist?`, checkResult2.isInWishlist);

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
console.log('🚀 Starting Wishlist Tests with Mock Data...\n');
testWishlistWithMockData(); 
