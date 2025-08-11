import React, { useEffect, useState } from 'react';
import api from './api';

export default function BuyerDashboard() {
  const [orders, setOrders] = useState([]);
  useEffect(() => { (async () => { const { data } = await api.get('/orders/me'); setOrders(data); })(); }, []);
  return (
    <div>
      <h2>My Orders</h2>
      <pre>{JSON.stringify(orders, null, 2)}</pre>
    </div>
  );
}