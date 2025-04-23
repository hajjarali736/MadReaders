import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "./Header";

export default function CouponManager() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [newCoupon, setNewCoupon] = useState({
    code: "",
    DiscountPercentage: "",
    ExpiryDate: "",
    MaxUses: "",
  });

  const [editId, setEditId] = useState(null);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3001/api/coupons");
      const data = await response.json();
      setCoupons(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch coupons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCoupon({ ...newCoupon, [name]: value });
  };

  const handleCreateOrUpdate = async () => {
    const method = editId ? "PUT" : "POST";
    const url = editId
      ? `http://localhost:3001/api/coupons/${editId}`
      : "http://localhost:3001/api/coupons";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCoupon),
      });

      if (!response.ok) throw new Error("Failed to save coupon");

      setNewCoupon({
        code: "",
        DiscountPercentage: "",
        ExpiryDate: "",
        MaxUses: "",
      });
      setEditId(null);
      await fetchCoupons();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:3001/api/coupons/${id}`, {
        method: "DELETE",
      });
      await fetchCoupons();
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (coupon) => {
    setEditId(coupon._id);
    setNewCoupon({
      code: coupon.code,
      DiscountPercentage: coupon.DiscountPercentage,
      ExpiryDate: coupon.ExpiryDate.slice(0, 10),
      MaxUses: coupon.MaxUses,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Coupon Management
          </h1>
          <div className="mb-4">
            <Link to="/dashboard">
              <button className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded">
                Go to Dashboard
              </button>
            </Link>
          </div>

          {/* Create/Edit Form */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <input
              name="code"
              value={newCoupon.code}
              onChange={handleInputChange}
              placeholder="Code"
              className="border px-3 py-2 rounded"
            />
            <input
              name="DiscountPercentage"
              value={newCoupon.DiscountPercentage}
              onChange={handleInputChange}
              placeholder="Discount %"
              type="number"
              className="border px-3 py-2 rounded"
            />
            <input
              name="ExpiryDate"
              value={newCoupon.ExpiryDate}
              onChange={handleInputChange}
              placeholder="Expiry Date"
              type="date"
              className="border px-3 py-2 rounded"
            />
            <input
              name="MaxUses"
              value={newCoupon.MaxUses}
              onChange={handleInputChange}
              placeholder="Max Uses"
              type="number"
              className="border px-3 py-2 rounded"
            />
            <button
              onClick={handleCreateOrUpdate}
              className="col-span-2 md:col-span-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded"
            >
              {editId ? "Update Coupon" : "Create Coupon"}
            </button>
          </div>

          {/* Table */}
          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="min-w-full border border-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Code</th>
                  <th className="px-4 py-2 text-left">Discount %</th>
                  <th className="px-4 py-2 text-left">Expiry Date</th>
                  <th className="px-4 py-2 text-left">Max Uses</th>
                  <th className="px-4 py-2 text-left">Used</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon) => (
                  <tr key={coupon._id} className="hover:bg-gray-100">
                    <td className="px-4 py-2">{coupon.code}</td>
                    <td className="px-4 py-2">{coupon.DiscountPercentage}%</td>
                    <td className="px-4 py-2">
                      {coupon.ExpiryDate.slice(0, 10)}
                    </td>
                    <td className="px-4 py-2">{coupon.MaxUses}</td>
                    <td className="px-4 py-2">{coupon.UsedCount}</td>
                    <td className="px-4 py-2">
                      {new Date(coupon.ExpiryDate) < new Date() ||
                      coupon.UsedCount >= coupon.MaxUses ? (
                        <span className="bg-red-100 text-red-700 px-2 py-1 text-xs rounded">
                          Expired
                        </span>
                      ) : (
                        <span className="bg-green-100 text-green-700 px-2 py-1 text-xs rounded">
                          Valid
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-2 space-x-2">
                      <button
                        onClick={() => startEdit(coupon)}
                        className="bg-yellow-400 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(coupon._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Delete
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
