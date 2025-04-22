import { useState, useEffect } from "react";
import Header from "./Header";

export default function ContactInquiries() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchContacts = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/contact");
      const data = await res.json();
      setContacts(data);
    } catch  {
      setError("Failed to fetch contact inquiries");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await fetch(`http://localhost:3001/api/contact/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Status: newStatus }),
      });
      fetchContacts(); // Refresh
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Contact Inquiries
          </h1>

          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Subject</th>
                  <th className="px-4 py-2">Message</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact) => (
                  <tr key={contact._id} className="border-t">
                    <td className="px-4 py-2">{contact.Name}</td>
                    <td className="px-4 py-2">{contact.Email}</td>
                    <td className="px-4 py-2">{contact.Subject}</td>
                    <td className="px-4 py-2 max-w-sm truncate">
                      {contact.Message}
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          contact.Status === "Unread"
                            ? "bg-red-100 text-red-600"
                            : contact.Status === "Read"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {contact.Status}
                      </span>
                    </td>
                    <td className="px-4 py-2 space-x-2">
                      <button
                        onClick={() => updateStatus(contact._id, "Read")}
                        className="bg-yellow-400 text-white px-2 py-1 rounded text-xs"
                      >
                        Mark Read
                      </button>
                      <button
                        onClick={() => updateStatus(contact._id, "Responded")}
                        className="bg-green-500 text-white px-2 py-1 rounded text-xs"
                      >
                        Mark Responded
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
