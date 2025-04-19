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
  resetDatabase,
} from "./Schema.js";

const uri =
  "mongodb+srv://admin:admin@madreaders.dvcyjvw.mongodb.net/?retryWrites=true&w=majority&appName=madreaders";

// Sample data arrays
const sampleUsers = [
  {
    Name: "John Doe",
    Email: "john@example.com",
    PhoneNumber: "+96170123456",
    Address: "123 Main St",
    Role: "admin",
  },
  {
    Name: "Jane Smith",
    Email: "jane@example.com",
    PhoneNumber: "+96170123457",
    Address: "456 Oak Ave",
    Role: "user",
  },
  {
    Name: "Alice Johnson",
    Email: "alice@example.com",
    PhoneNumber: "+96170123458",
    Address: "789 Pine Rd",
    Role: "user",
  },
  {
    Name: "Bob Wilson",
    Email: "bob@example.com",
    PhoneNumber: "+96170123459",
    Address: "321 Elm St",
    Role: "user",
  },
  {
    Name: "Carol Brown",
    Email: "carol@example.com",
    PhoneNumber: "+96170123460",
    Address: "654 Maple Dr",
    Role: "user",
  },
  {
    Name: "David Lee",
    Email: "david@example.com",
    PhoneNumber: "+96170123461",
    Address: "987 Cedar Ln",
    Role: "user",
  },
  {
    Name: "Eva Garcia",
    Email: "eva@example.com",
    PhoneNumber: "+96170123462",
    Address: "147 Birch Rd",
    Role: "user",
  },
  {
    Name: "Frank Miller",
    Email: "frank@example.com",
    PhoneNumber: "+96170123463",
    Address: "258 Walnut Ave",
    Role: "user",
  },
  {
    Name: "Grace Taylor",
    Email: "grace@example.com",
    PhoneNumber: "+96170123464",
    Address: "369 Spruce St",
    Role: "user",
  },
  {
    Name: "Henry Martinez",
    Email: "henry@example.com",
    PhoneNumber: "+96170123465",
    Address: "741 Pine Ct",
    Role: "user",
  },
];

const sampleBooks = [
  {
    BookID: "BOOK001",
    GoogleBooksID: "gb001",
    Price: 29.99,
    StockQuantity: 50,
    EbookAvailability: true,
  },
  {
    BookID: "BOOK002",
    GoogleBooksID: "gb002",
    Price: 19.99,
    StockQuantity: 30,
    EbookAvailability: true,
  },
  {
    BookID: "BOOK003",
    GoogleBooksID: "gb003",
    Price: 24.99,
    StockQuantity: 40,
    EbookAvailability: false,
  },
  {
    BookID: "BOOK004",
    GoogleBooksID: "gb004",
    Price: 14.99,
    StockQuantity: 25,
    EbookAvailability: true,
  },
  {
    BookID: "BOOK005",
    GoogleBooksID: "gb005",
    Price: 34.99,
    StockQuantity: 20,
    EbookAvailability: true,
  },
  {
    BookID: "BOOK006",
    GoogleBooksID: "gb006",
    Price: 22.99,
    StockQuantity: 35,
    EbookAvailability: false,
  },
  {
    BookID: "BOOK007",
    GoogleBooksID: "gb007",
    Price: 27.99,
    StockQuantity: 45,
    EbookAvailability: true,
  },
  {
    BookID: "BOOK008",
    GoogleBooksID: "gb008",
    Price: 17.99,
    StockQuantity: 15,
    EbookAvailability: true,
  },
  {
    BookID: "BOOK009",
    GoogleBooksID: "gb009",
    Price: 39.99,
    StockQuantity: 10,
    EbookAvailability: false,
  },
  {
    BookID: "BOOK010",
    GoogleBooksID: "gb010",
    Price: 32.99,
    StockQuantity: 25,
    EbookAvailability: true,
  },
];

const orderStatuses = ["Pending", "Processing", "Shipped", "Delivered"];

async function runTests() {
  try {
    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB");

    // Reset the database
    console.log("🧹 Resetting database...");
    await resetDatabase();
    console.log("✅ Database reset complete");

    // Create Users
    console.log("\n🧪 Creating Users...");
    const users = await User.insertMany(sampleUsers);
    console.log(`✅ Created ${users.length} users`);

    // Create Books
    console.log("\n🧪 Creating Books...");
    const books = await Book.insertMany(sampleBooks);
    console.log(`✅ Created ${books.length} books`);

    // Create Coupons
    console.log("\n🧪 Creating Coupons...");
    const coupons = await Coupon.insertMany([
      {
        DiscountPercentage: 20,
        ExpiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        MaxUses: 100,
      },
      {
        DiscountPercentage: 15,
        ExpiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        MaxUses: 50,
      },
      {
        DiscountPercentage: 25,
        ExpiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        MaxUses: 75,
      },
      {
        DiscountPercentage: 10,
        ExpiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        MaxUses: 200,
      },
      {
        DiscountPercentage: 30,
        ExpiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        MaxUses: 25,
      },
    ]);
    console.log(`✅ Created ${coupons.length} coupons`);

    // Create Orders and OrderItems
    console.log("\n🧪 Creating Orders and OrderItems...");
    for (let i = 0; i < 10; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const book = books[Math.floor(Math.random() * books.length)];
      const status =
        orderStatuses[Math.floor(Math.random() * orderStatuses.length)];

      const order = await Order.create({
        UserID: user._id,
        TotalAmount: book.Price,
        OrderStatus: status,
      });

      await OrderItem.create({
        OrderID: order._id,
        BookID: book.BookID,
        Price: book.Price,
        Quantity: Math.floor(Math.random() * 3) + 1,
      });

      // Create Payment for order
      await Payment.create({
        OrderID: order._id,
        UserID: user._id,
        PaymentMethod: ["CreditCard", "PayPal", "CashOnDelivery"][
          Math.floor(Math.random() * 3)
        ],
        Amount: book.Price,
        Status: "Completed",
      });
    }
    console.log("✅ Created 10 orders with items and payments");

    // Create Reviews
    console.log("\n🧪 Creating Reviews...");
    for (let i = 0; i < 15; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const book = books[Math.floor(Math.random() * books.length)];
      try {
        await Review.create({
          UserID: user._id,
          BookID: book.BookID,
          Rating: Math.floor(Math.random() * 5) + 1,
          Comment: [
            "Great book!",
            "Loved it!",
            "Highly recommend!",
            "Could be better",
            "Interesting read",
          ][Math.floor(Math.random() * 5)],
        });
      } catch (err) {
        if (err.code !== 11000) {
          throw err;
        }
      }
    }
    const reviewCount = await Review.countDocuments();
    console.log(`✅ Created ${reviewCount} reviews`);

    // Create Wishlists
    console.log("\n🧪 Creating Wishlists...");
    for (let i = 0; i < 10; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const book = books[Math.floor(Math.random() * books.length)];
      try {
        await Wishlist.create({
          UserID: user._id,
          BookID: book.BookID,
        });
      } catch (err) {
        if (err.code !== 11000) {
          throw err;
        }
      }
    }
    const wishlistCount = await Wishlist.countDocuments();
    console.log(`✅ Created ${wishlistCount} wishlist items`);

    // Create Shopping Cart Items
    console.log("\n🧪 Creating Shopping Cart Items...");
    for (let i = 0; i < 10; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const book = books[Math.floor(Math.random() * books.length)];
      try {
        await ShoppingCart.create({
          UserID: user._id,
          BookID: book.BookID,
          Quantity: Math.floor(Math.random() * 3) + 1,
        });
      } catch (err) {
        if (err.code !== 11000) {
          throw err;
        }
      }
    }
    const cartCount = await ShoppingCart.countDocuments();
    console.log(`✅ Created ${cartCount} shopping cart items`);

    // Create Contact Forms
    console.log("\n🧪 Creating Contact Forms...");
    const contacts = await Contact.insertMany(
      Array.from({ length: 10 }, (_, i) => ({
        Name: `Contact Person ${i + 1}`,
        Email: `contact${i + 1}@example.com`,
        Subject: `Subject ${i + 1}`,
        Message: `This is test message ${i + 1}`,
        Status: ["Unread", "Read", "Responded"][Math.floor(Math.random() * 3)],
      }))
    );
    console.log(`✅ Created ${contacts.length} contact form submissions`);

    console.log("\n✅ All test data created successfully!");
  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

runTests();
