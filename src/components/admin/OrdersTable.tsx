'use client';

import React, { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

interface Order {
  id: string;
  productId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerCity: string;
  status: string;
  createdAt: string;
}

interface Product {
  id: string;
  title: string;
  price: number;
}

export default function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Record<string, Product>>({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrdersAndProducts = async () => {
    try {
      setIsLoading(true);
      const [ordersRes, productsRes] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/products')
      ]);

      if (!ordersRes.ok || !productsRes.ok) throw new Error('Failed to fetch data');

      const ordersData = await ordersRes.json();
      const productsData: Product[] = await productsRes.json();

      const productMap: Record<string, Product> = {};
      productsData.forEach(p => { productMap[p.id] = p; });

      setOrders(ordersData);
      setProducts(productMap);
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: 'Failed to load orders', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdersAndProducts();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error('Failed to update status');

      toast({ title: 'Status Updated', description: `Order status changed to ${newStatus}` });
      fetchOrdersAndProducts();
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: 'Failed to update status', variant: 'destructive' });
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading orders...</div>;
  }

  if (orders.length === 0) {
    return <div className="p-8 text-center text-muted-foreground bg-muted/20 rounded-lg">No orders yet.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
          <tr>
            <th className="px-4 py-3 font-medium">Customer Info</th>
            <th className="px-4 py-3 font-medium">Product / Price</th>
            <th className="px-4 py-3 font-medium">Address</th>
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {orders.map((order) => {
            const product = products[order.productId];
            
            return (
              <tr key={order.id} className="hover:bg-muted/10 transition-colors">
                <td className="px-4 py-3">
                  <div className="font-medium text-foreground">{order.customerName}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{order.customerPhone}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-foreground">{product?.title || 'Unknown Product'}</div>
                  {product && <div className="text-xs text-muted-foreground mt-0.5">{product.price} DH</div>}
                </td>
                <td className="px-4 py-3">
                  <div className="text-foreground">{order.customerCity}</div>
                  <div className="text-xs text-muted-foreground mt-0.5 max-w-[200px] truncate" title={order.customerAddress}>
                    {order.customerAddress}
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
                    ${order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${order.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' : ''}
                    ${order.status === 'Shipped' ? 'bg-purple-100 text-purple-800' : ''}
                    ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : ''}
                    ${order.status === 'Cancelled' ? 'bg-red-100 text-red-800' : ''}
                  `}>
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <select
                    className="text-xs bg-background border border-input rounded p-1 text-foreground cursor-pointer focus:ring-1 focus:ring-primary"
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
