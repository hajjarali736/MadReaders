import fetch from "node-fetch";

const users = Array.from({ length: 1 }).map((_, i) => ({
  Username: `user${i + 1}`,
  Name: `User ${i + 1}`,
  Email: `user${i + 1}@example.com`,
  PhoneNumber: `7000000${i}`,
  Address: `City ${i + 1}`,
  Role: i === 0 ? "admin" : "user", // first one is admin
}));

async function seedUsers() {
  for (const user of users) {
    try {
      const res = await fetch("http://localhost:3001/api/users/list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      const data = await res.json();
      // console.log(user.Username, "=>", data.success ? "✅ Inserted" : `❌ ${data.message}`);
      console.log(user.Username, "=>", data);
    } catch (err) {
      console.error("❌ Error inserting", user.Username, err.message);
    }
  }
}

seedUsers();
