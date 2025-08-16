import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";

const TAX_RATE = 0.13;

export default function Checkout() {
  const navigate = useNavigate();
  const money = useMemo(
    () => new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }),
    []
  );

  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "", 
    phone: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    country: "Canada",
  });
  const [errors, setErrors] = useState({});

  // Load cart +
  useEffect(() => {
    setItems(JSON.parse(localStorage.getItem("cart") || "[]"));

    const userEmail = localStorage.getItem("userEmail");
    if (userEmail) {
      setForm((f) => ({ ...f, email: userEmail }));
    }
  }, []);

  const subtotal = items.reduce(
    (s, it) => s + Number(it.price || 0) * Number(it.qty || 1),
    0
  );
  const tax = +(subtotal * TAX_RATE).toFixed(2);
  const total = subtotal + tax;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Canadian provinces list
  const provinces = [
    "AB", "BC", "MB", "NB", "NL", "NS", "NT", "NU",
    "ON", "PE", "QC", "SK", "YT"
  ];

  // Validation rules
  const validate = () => {
    const newErrors = {};

    if (!/^[A-Za-z\s]{3,}$/.test(form.name)) {
      newErrors.name = "Enter your full name (letters only, min 3 chars)";
    }

    // Only validate email if user typed it manually
    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!localStorage.getItem("userEmail")) {
      if (!/^\S+@\S+\.\S+$/.test(form.email)) {
        newErrors.email = "Enter a valid email address";
      }
    }

    if (!/^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/.test(form.phone)) {
      newErrors.phone = "Enter a valid phone number (e.g. 123-456-7890)";
    }
    if (form.address.length < 5) {
      newErrors.address = "Enter a valid street address";
    }
    if (!/^[A-Za-z\s]{2,}$/.test(form.city)) {
      newErrors.city = "Enter a valid city";
    }
    if (!form.province) {
      newErrors.province = "Select a province";
    }
    if (!/^[A-Za-z]\d[A-Za-z][ ]?\d[A-Za-z]\d$/.test(form.postalCode)) {
      newErrors.postalCode = "Enter a valid Canadian postal code (e.g. K1A 0B1)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const placeOrder = async () => {
    if (!items.length) {
      alert("Cart is empty");
      return;
    }

    if (!validate()) return;

    try {
      const payload = {
        items: items.map((i) => ({ bookId: i.bookId, qty: i.qty })),
        shipping: form,
        payment: "Cash on Delivery",
      };

      await api.post("/orders", payload);

      localStorage.removeItem("cart");
      setItems([]);
      sessionStorage.setItem("justOrdered", "1");
      navigate("/buyer");
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to place order.");
    }
  };

  return (
    <div className="container page--checkout">
      <h2>Checkout</h2>
      <p><strong>Payment Method:</strong> Cash on Delivery (COD)</p>

      <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
        {/* Shipping Form */}
        <div style={{ flex: 1, minWidth: 280 }}>
          <h3>Shipping Details</h3>

          {/* Name */}
          <div style={{ marginBottom: 12 }}>
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              style={{ width: "100%", padding: 6 }}
            />
            {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}
          </div>

          {/* Email */}
          <div style={{ marginBottom: 12 }}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              readOnly={!!localStorage.getItem("userEmail")} // lock if prefilled
              style={{ width: "100%", padding: 6, background: form.email ? "#f5f5f5" : "white" }}
            />
            {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
          </div>

          {/* Phone */}
          <div style={{ marginBottom: 12 }}>
            <label>Phone</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="123-456-7890"
              style={{ width: "100%", padding: 6 }}
            />
            {errors.phone && <p style={{ color: "red" }}>{errors.phone}</p>}
          </div>

          {/* Address */}
          <div style={{ marginBottom: 12 }}>
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              style={{ width: "100%", padding: 6 }}
            />
            {errors.address && <p style={{ color: "red" }}>{errors.address}</p>}
          </div>

          {/* City */}
          <div style={{ marginBottom: 12 }}>
            <label>City</label>
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              style={{ width: "100%", padding: 6 }}
            />
            {errors.city && <p style={{ color: "red" }}>{errors.city}</p>}
          </div>

          {/* Province */}
          <div style={{ marginBottom: 12 }}>
            <label>Province</label>
            <select
              name="province"
              value={form.province}
              onChange={handleChange}
              style={{ width: "100%", padding: 6 }}
            >
              <option value="">Select Province</option>
              {provinces.map((prov) => (
                <option key={prov} value={prov}>
                  {prov}
                </option>
              ))}
            </select>
            {errors.province && <p style={{ color: "red" }}>{errors.province}</p>}
          </div>

          {/* Postal Code */}
          <div style={{ marginBottom: 12 }}>
            <label>Postal Code</label>
            <input
              type="text"
              name="postalCode"
              value={form.postalCode}
              onChange={handleChange}
              placeholder="A1A 1A1"
              style={{ width: "100%", padding: 6 }}
            />
            {errors.postalCode && <p style={{ color: "red" }}>{errors.postalCode}</p>}
          </div>

          {/* Country (fixed to Canada) */}
          <div style={{ marginBottom: 12 }}>
            <label>Country</label>
            <input
              type="text"
              name="country"
              value={form.country}
              disabled
              style={{ width: "100%", padding: 6, background: "#f5f5f5" }}
            />
          </div>

          <button className="btn btn--primary" onClick={placeOrder}>
            Place Order
          </button>
        </div>

        {/* Cart Summary */}
        <div style={{ flex: 1, minWidth: 280 }}>
          <h3>Order Summary</h3>
          {items.map((it) => (
            <div
              key={it.bookId}
              style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}
            >
              <span>
                {it.title} x {it.qty}
              </span>
              <span>{money.format(it.price * it.qty)}</span>
            </div>
          ))}
          <hr />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <strong>Subtotal:</strong> <span>{money.format(subtotal)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <strong>Tax:</strong> <span>{money.format(tax)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <strong>Total:</strong> <span>{money.format(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
